"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { getPatientById, updatePatient } from "@/lib/actions/patient-actions"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"

const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().min(0, {
    message: "Age must be a positive number.",
  }),
  gender: z.enum(["M", "F", "Other"], {
    required_error: "Please select a gender.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  medicalHistory: z.string().optional(),
})

type PatientFormValues = z.infer<typeof patientFormSchema>

function EditPatientPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams()
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: undefined,
      address: "",
      phoneNumber: "",
      medicalHistory: "",
    },
  })

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setIsLoading(true)
        const result = await getPatientById(String(params?.id))

        if (result.success && result.data) {
          form.reset({
            name: result.data.name,
            age: result.data.age,
            gender: result.data.gender,
            address: result.data.address,
            phoneNumber: result.data.phoneNumber,
            medicalHistory: result.data.medicalHistory || "",
          })
        } else {
          toast.error("Error", {
            
            description: result.error || "Failed to load patient data",
        
          })
          router.push("/patients")
        }
      } catch (error) {
        console.error("Error loading patient:", error)
        toast("Error", {
          
          description: "Failed to load patient data. Please try again.",
      
        })
        router.push("/patients")
      } finally {
        setIsLoading(false)
      }
    }

    loadPatient()
  }, [params.id, form, router])

  async function onSubmit(data: PatientFormValues) {
    try {
      setIsSubmitting(true)
      const result = await updatePatient(String(params?.id), data)

      if (result.success) {
        toast("Patient updated", {
          description: `${data.name}'s information has been updated.`,
        });
        router.push(`/patients/${params.id}`)
      } else {
        toast.error("Error", {
         
          description: Array.isArray(result.error)
            ? result.error.map((err) => err.message).join(", ")
            : result.error || "Failed to update patient",
        
        })
      }
    } catch (error) {
      console.error("Error updating patient:", error)
      toast.error("Error", {
      
        description: "Failed to update patient. Please try again.",
        
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Link href={`/patients/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          {/* <h1 className="text-3xl font-bold tracking-tight">Edit Patient</h1> */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Update the patient's details.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Full Name<span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Age<span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          Gender<span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="M" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Male
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="F" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Female
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Other" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Other
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone Number<span className="text-red-400">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address<span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, Anytown, CA"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="medicalHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical History (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any relevant medical history..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any chronic conditions, allergies, or previous
                        surgeries.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between mt-3">
                <Link href={`/patients/${params.id}`}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function EditPage() {
  return (
    <DashboardLayout>
      <EditPatientPage />
    </DashboardLayout>
  );
}

