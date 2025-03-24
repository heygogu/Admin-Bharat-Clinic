"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { getPrescriptionById, updatePrescription } from "@/lib/actions/prescription-actions"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"
import { getPatients } from "@/lib/actions/patient-actions"

const medicationSchema = z.object({
  name: z.string().min(2, {
    message: "Medication name must be at least 2 characters.",
  }),
  dosage: z.string().min(1, {
    message: "Dosage is required.",
  }),
  frequency: z.string().min(1, {
    message: "Frequency is required.",
  }),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
})

const prescriptionFormSchema = z.object({
  patientId: z.string().min(1, {
    message: "Patient is required.",
  }),
  medications: z.array(medicationSchema).min(1, {
    message: "At least one medication is required.",
  }),
  notes: z.string().optional(),
  appointmentId: z.string().optional(),
})

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>
const fetchPatients = async () => {
  // In a real app, this would be an API call

  const patients=await getPatients()
  console.log(patients,"patients")

  return patients?.data?.map((patient:any)=>({
    id:patient?._id,
    name:patient?.name +  " | " + patient?.phoneNumber
  }))
}


function EditPrescription({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [patients, setPatients] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientId: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: "",
      appointmentId: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  })

  // Fetch prescription data
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setIsLoading(true)
        const result = await getPrescriptionById(params.id)

        if (result.success && result.data) {
          const prescription = result.data

          form.reset({
            patientId: prescription.patient._id,
            medications: prescription.medications,
            notes: prescription.notes || "",
            appointmentId: prescription.appointment?._id || "",
          })

          setSelectedPatientId(prescription.patient._id)
        } else {
          toast.error("Error", {
         
            description: result.error || "Failed to load prescription data",
           
          })
          router.push("/prescriptions")
        }
      } catch (error) {
        console.error("Error loading prescription:", error)
        toast.error("Error", {
          description: "Failed to load prescription data. Please try again.",
          // variant: "destructive",
        })
        router.push("/prescriptions")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrescription()
  }, [params.id, form, router])

  // Fetch patients
  useEffect(() => {
  fetchPatients().then(setPatients)
  }, [])

  // Fetch appointments when patient changes
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedPatientId) {
        setAppointments([])
        return
      }

      try {
        const response = await fetch(`/api/patients/${selectedPatientId}/appointments`)
        const result = await response.json()

        if (result.success) {
          setAppointments(result.data)
        } else {
          console.error("Failed to fetch appointments:", result.error)
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }

    fetchAppointments()
  }, [selectedPatientId])

  // Update appointments when patient changes
  const handlePatientChange = (value: string) => {
    form.setValue("patientId", value)
    form.setValue("appointmentId", "") // Reset appointment when patient changes
    setSelectedPatientId(value)
  }

  async function onSubmit(data: PrescriptionFormValues) {
    try {
      setIsSubmitting(true)
      const result = await updatePrescription(params.id, data)

      if (result.success) {
        toast("Success", {
          description: "Prescription updated successfully.",
        });
        if (data.patientId) {
          router.push(`/patients/${data.patientId}`)
        } else {
          router.push("/prescriptions")
        }
      } else {
        toast.error("Error", {
          description: Array.isArray(result.error)
            ? result.error.map((err) => err.message).join(", ")
            : result.error || "Failed to update prescription",
        //   variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating prescription:", error)
      toast.error("Error", {
        description: "Failed to update prescription. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading prescription data...</p>
        </div>
      </div>
    )
  }

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Link href="/prescriptions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Prescription</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Information</CardTitle>
          <CardDescription>Update the prescription details.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select onValueChange={handlePatientChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient._id} value={patient._id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="appointmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPatientId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an appointment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No appointment</SelectItem>
                        {appointments.map((appointment) => (
                          <SelectItem key={appointment._id} value={appointment._id}>
                            {new Date(appointment.date).toLocaleDateString()} - {appointment.reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Link this prescription to a specific appointment.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <FormLabel className="text-base">Medications</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", dosage: "", frequency: "", duration: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-md mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`medications.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Amoxicillin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 500mg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 3 times daily" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`medications.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 7 days" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <FormMessage>{form.formState.errors.medications?.message}</FormMessage>
              </div>

              <FormField

                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any additional notes here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Prescription
                  </>
                )}
              </Button>
            </CardFooter>
            </form>
        </Form>
        </Card>
    </div>
    </PageContainer>
  )
    }


export default function EditPrescriptionPage(
    { params }: { params: { id: string } }
  ) {
    return <DashboardLayout>
        <EditPrescription params={params} />
    </DashboardLayout>
}
