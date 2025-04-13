"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/file-uploader";
import { useEffect, useState } from "react";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";
import {
  getPatientById,
  getPatientByNameOrPhone,
  getPatients,
  getRecentPatients,
} from "@/lib/actions/patient-actions";
import axios from "axios";
import { createLabResult } from "@/lib/actions/lab-result-actions";
import dayjs from "dayjs";
import { getAppointmentByPatientId } from "@/lib/actions/appointment-actions";

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
  appointmentId: z.string(),
});

type LabResultFormValues = z.infer<typeof labResultFormSchema>;

const fetchPatients = async (id:string) => {
  // In a real app, this would be an API call

  const response = await getPatientById(id);
  const patient = response.data;
  console.log(patient, "patients");

  return {
    _id: patient._id,
    name: patient.name
  }
};
interface Patient {
  _id: string;
  name: string;
  phoneNumber: string;
}

function NewLabResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [patient, setPatient] = useState()as any;
  const [isUploading, setIsUploading] = useState(false);
  const [progresses, setProgresses] = useState<Record<string, number>>({});
  const [labImageURL, setLabImageURL] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  console.log(patient, "patientId");
  const form = useForm<LabResultFormValues>({
    resolver: zodResolver(labResultFormSchema),
    defaultValues: {
      patientId: patientId || "",
      type: undefined,
      details: "",
      notes: "",
    },
  });

  async function uploadImage({ formData }: { formData: FormData }) {
    try {
      const response = await axios.post(`/api/upload-image`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // toast.success("Image uploaded successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Server action error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

useEffect(() => {
  if (searchParams.get("patientId")) {
    fetchPatients(searchParams.get("patientId")!).then((data) => {
      setPatient(data);
      console.log(data, "patient");
      // Make sure you're using the consistent ID field
      form.setValue("patientId", data._id); // Change from data.id to data._id
    });
  }
  getAppointments();

}, [searchParams, form]);
  console.log(patient, "patient");

async function getAppointments(){
  try{
      const appointments=await getAppointmentByPatientId(patientId!);
      setAppointments(appointments.data);
      console.log(appointments.data, "appointments");
  }catch(error){
    console.log(error)
  }
}

  async function onSubmit(data: LabResultFormValues) {
    try {
      // In a real app, you would send this data to your API
      if (!labImageURL) {
        toast.error("Error", {
          description: "Please upload a file",
        });
        return;
      }
      console.log(data);

      await createLabResult(data, labImageURL);

      toast("Lab result added");

      if (patientId) {
        router.push(`/patients/${patientId}`);
      } else {
        router.push("/lab-results");
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to add lab result. Please try again.",
      });
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
            <CardDescription>
              Enter the details of the lab result.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // Change defaultValue to value for controlled component
                        >
                          <FormControl>
                            <SelectTrigger disabled={!!patientId}>
                              <SelectValue
                                placeholder={
                                  patient ? patient.name : "Select a patient"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patient && (
                              <SelectItem key={patient._id} value={patient._id}>
                                {patient.name}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {/* <FormDescription>
                          Select a patient from the list or search by name or
                          phone number.
                        </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="appointmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appointment</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // Change defaultValue to value for controlled component
                        >
                          <FormControl>
                            <SelectTrigger >
                              <SelectValue
                                placeholder={
                                  appointments.length > 0
                                    ? "Select an appointment"
                                    : "No appointments available"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appointments?.map((appointment) => (
                              <SelectItem
                                key={appointment?._id}
                                value={appointment?._id}
                              >
                                {`${appointment?.serialNumber} - ${dayjs(appointment?.createdAt).format(
                                  "DD MMM YYYY"
                                )}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                        <Input
                          placeholder="Enter lab result details"
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
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes..."
                          className="resize-none"
                          {...field}
                        />
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
                          onValueChange={async (files) => {
                            field.onChange(files[0]);
                            if (!files[0]) return;
                            try {
                              const formData = new FormData();
                              formData.append("image", files[0]);
                              async function image() {
                                const result = await uploadImage({ formData });
                                if (result.success) {
                                  toast(
                                    "Lab Image Uploaded successfully!"
                                  );
                                  // console.log(result.data?.data?.secure_url,"from cloudinary")

                                  setLabImageURL(result.data?.data?.secure_url);
                                  return result.data?.data?.secure_url;
                                } else {
                                  toast.error("Could not upload cover image", {
                                    description:
                                      result.error || "Error sending email.",
                                  });
                                }
                              };
                              image()
                            } catch (error) {
                              console.error("Error uploading image:", error);
                              return null;
                            }
                          }}
                          maxFileCount={1}
                          maxSize={4 * 1024 * 1024}
                          progresses={progresses}
                          // pass the onUpload function here for direct upload
                          // onUpload={uploadFiles}
                          disabled={isUploading}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload X-ray images, lab reports, or other relevant
                        files (max 4MB).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link
                  href={patientId ? `/patients/${patientId}` : "/lab-results"}
                >
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
  );
}

export default function NewLabResult() {
  return (
    <DashboardLayout>
      <NewLabResultPage />
    </DashboardLayout>
  );
}
