"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"

import { createPrescription } from "@/lib/actions/prescription-actions"
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
})

type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>

// Mock function to fetch patients
const fetchPatients = async () => {
  // In a real app, this would be an API call

  const patients=await getPatients()
  console.log(patients,"patients")

  return patients?.data?.map((patient:any)=>({
    id:patient?._id,
    name:patient?.name +  " | " + patient?.phoneNumber
  }))
}

 function NewPrescriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")
  const [patients, setPatients] = useState([ ])

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientId: patientId || "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "" }],
      notes: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  })

  useEffect(() => {
    fetchPatients().then(setPatients)
  },[])

  async function onSubmit(data: PrescriptionFormValues) {
    try {
      // In a real app, you would send this data to your API
      console.log(data)
      await createPrescription(data)

      toast("Prescription created",  {
        description: `Prescription has been added to the patient's record.`,
      });

      if (patientId) {
        router.push(`/patients/${patientId}`)
      } else {
        router.push("/prescriptions")
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create prescription. Please try again.",
       
      });
    }
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Link href={patientId ? `/patients/${patientId}` : "/prescriptions"}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            New Prescription
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription Information</CardTitle>
            <CardDescription>
              Create a new prescription for the patient.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Patient<span className="text-red-400">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!!patientId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {patients.map((patient: any) => (
                            <SelectItem key={patient?.id} value={patient?.id}>
                              {patient?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <FormLabel className="text-base">
                      Medications<span className="text-red-400">*</span>
                    </FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          name: "",
                          dosage: "",
                          frequency: "",
                          duration: "",
                        })
                      }
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
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
                              <FormLabel>
                                Medication Name
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Amoxicillin"
                                  {...field}
                                />
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
                              <FormLabel>
                                Dosage<span className="text-red-400">*</span>
                              </FormLabel>
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
                              <FormLabel>
                                Frequency<span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., 3 times daily"
                                  {...field}
                                />
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
                              <FormLabel>
                                Duration<span className="text-red-400">*</span>
                              </FormLabel>
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
                  <FormMessage>
                    {form.formState.errors.medications?.message}
                  </FormMessage>
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional instructions or notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any special instructions for the patient.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between mt-3">
                <Link
                  href={patientId ? `/patients/${patientId}` : "/prescriptions"}
                >
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Prescription
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function NewPrescription(){
  return <DashboardLayout>
    <NewPrescriptionPage/>
  </DashboardLayout>
}

