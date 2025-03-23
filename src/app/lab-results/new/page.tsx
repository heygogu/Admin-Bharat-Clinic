"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploader } from "@/components/file-uploader"
import { useState } from "react"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"

const labResultFormSchema = z.object({
  patientId: z.string().min(1, {
    message: "Patient is required.",
  }),
  type: z.enum(["X-Ray", "Blood Test", "Scan", "Other"], {
    required_error: "Please select a lab result type.",
  }),
  details: z.string().min(5, {
    message: "Details must be at least 5 characters.",
  }),
  notes: z.string().optional(),
  fileUrl: z.instanceof(File).optional(),
});

type LabResultFormValues = z.infer<typeof labResultFormSchema>

// Mock function to fetch patients
const fetchPatients = async () => {
  // In a real app, this would be an API call
  return [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Johnson" },
  ]
}

function NewLabResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")
  const [patients, setPatients] = useState([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Robert Johnson" },
  ])
  const [isUploading, setIsUploading] = useState(false)
  const [progresses, setProgresses] = useState<Record<string, number>>({})

  const form = useForm<LabResultFormValues>({
    resolver: zodResolver(labResultFormSchema),
    defaultValues: {
      patientId: patientId || "",
      type: undefined,
      details: "",
      notes: "",
      fileUrl: undefined,
    },
  })

  async function onSubmit(data: LabResultFormValues) {
    try {
      // In a real app, you would send this data to your API
      console.log(data)

      toast("Lab result added", {
        description: `Lab result has been added to the patient's record.`,
      });

      if (patientId) {
        router.push(`/patients/${patientId}`)
      } else {
        router.push("/lab-results")
      }
    } catch (error) {
      toast.error("Error", {
        
        description: "Failed to add lab result. Please try again.",
        
      })
    }
  }

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Link href={patientId ? `/patients/${patientId}` : "/lab-results"}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">New Lab Result</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lab Result Information</CardTitle>
          <CardDescription>Enter the details of the lab result.</CardDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!patientId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="X-Ray">X-Ray</SelectItem>
                        <SelectItem value="Blood Test">Blood Test</SelectItem>
                        <SelectItem value="Scan">Scan</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter lab result details" {...field} />
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter any additional notes..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value ? [field.value] : []}
                        onValueChange={field.onChange}
                        maxFileCount={1}
                        maxSize={4 * 1024 * 1024}
                        progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload X-ray images, lab reports, or other relevant files (max 4MB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={patientId ? `/patients/${patientId}` : "/lab-results"}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Lab Result
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
    </PageContainer>
  )
}

export default function NewLabResult(){
  return <DashboardLayout>
    <NewLabResultPage/>
  </DashboardLayout>
}

