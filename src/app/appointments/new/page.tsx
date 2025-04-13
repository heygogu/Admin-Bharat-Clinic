"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useEffect, useState } from "react"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"
import { createAppointment } from "@/lib/actions/appointment-actions"
import { getPatientByNameOrPhone, getPatients } from "@/lib/actions/patient-actions"
import { SearchableSelect } from "@/components/SearchableSelect"
import { Label } from "@radix-ui/react-dropdown-menu"

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, {
    message: "Patient is required.",
  }),
  date: z.date({
    required_error: "Appointment date is required.",
  }),
  time: z.string().min(1, {
    message: "Appointment time is required.",
  }),
  reason: z.string().min(2, {
    message: "Reason must be at least 2 characters.",
  }),
  notes: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>



interface Patient {
  _id: string
  name: string
  phoneNumber: string
}
// Mock function to fetch patients
const fetchPatients = async () => {
  // In a real app, this would be an API call

  const patients=await getPatients()
  console.log(patients,"patients")

  return patients?.data?.map((patient:Patient)=>({
    value:patient?._id,
    label:patient?.name +  " | " + patient?.phoneNumber
  }))
}

function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")
  const [patients, setPatients] = useState([
 
  ])


  useEffect(() => {
    fetchPatients().then(setPatients)
  }, [])
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: patientId || "",
      date: undefined,
      time: "",
      reason: "",
      notes: "",
    },
  })

  async function onSubmit(data: AppointmentFormValues) {
    try {
      // In a real app, you would send this data to your API
      console.log(data)
      await createAppointment(data)

      toast("Appointment scheduled",{
        
        description: `Appointment has been scheduled for ${format(data.date, "PPP")} at ${data.time}.`,
      })

      if (patientId) {
        router.push(`/patients/${patientId}`)
      } else {
        router.push("/appointments/page/1")
      }
    } catch (error) {
      toast.error("Error",{
       
        description: "Failed to schedule appointment. Please try again.",
        
      })
    }
  }
  const searchPatients = async (query: string) => {
      const results =await getPatientByNameOrPhone(query)
      return results?.data?.map((patient:Patient)=>({
        value:patient?._id,
        label:patient?.name +  " | " + patient?.phoneNumber
      }))
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Link
            href={patientId ? `/patients/${patientId}` : "/appointments/page/1"}
          >
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">New Appointment</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
            <CardDescription>
              Schedule a new appointment for the patient.
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
                      {/* <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!patientId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient:{
                          id:string,
                          name:string
                          phoneNumber:string
                        }) => (
                          <SelectItem key={patient?.id} value={patient?.id}>
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                      <SearchableSelect
                        value={field.value}
                        onChange={field.onChange}
                        onSearch={searchPatients}
                        items={patients}
                        placeholder="Select a patient"
                        disabled={!!patientId}
                        required
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Date<span className="text-red-400">*</span>
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return date < today
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Time<span className="text-red-400">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                            <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                            <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                            <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                            <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                            <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                            <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                            <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                            <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                            <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                            <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                            <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                            <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                            <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                            <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Reason for Visit<span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Annual checkup, Follow-up, Consultation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any special instructions or information for the
                        appointment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between mt-3">
                <Link
                  href={
                    patientId
                      ? `/patients/${patientId}`
                      : "/appointments/page/1"
                  }
                >
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function NewAppointment(){
  return <DashboardLayout>
    <NewAppointmentPage />
  </DashboardLayout>
}

