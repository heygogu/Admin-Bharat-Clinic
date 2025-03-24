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
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getPaymentById, updatePayment } from "@/lib/actions/payment-actions";
import DashboardLayout from "@/components/dashboard-layout";
import PageContainer from "@/components/page-container";
import { getPatients } from "@/lib/actions/patient-actions";
import { set } from "mongoose";
import { getAppointmentPayments } from "@/lib/actions/appointment-actions";

const paymentFormSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required." }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0." }),
  method: z.enum(["Cash", "G-Pay", "Card", "Other"], {
    required_error: "Payment method is required.",
  }),
  notes: z.string().optional(),
  appointmentId: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

 function EditPaymentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      patientId: "",
      amount: undefined,
      method: undefined,
      notes: "",
      appointmentId: "",
    },
  });

  // Fetch payment data
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setIsLoading(true);
        const result = await getPaymentById(params?.id);

        if (result.success && result.data) {
          const payment = result.data;

          form.reset({
            patientId: payment.patient._id,
            amount: payment.amount,
            method: payment.method,
            notes: payment.notes || "",
            appointmentId: payment.appointment?._id || "",
          });

          setSelectedPatientId(payment.patient._id);
        } else {
          toast.error("Error", {
            description: result.error || "Failed to load payment data",
            // variant: "destructive",
          });
          router.push("/payments");
        }
      } catch (error) {
        console.error("Error loading payment:", error);
        toast.error("Error", {
          description: "Failed to load payment data. Please try again.",
        //   variant: "destructive",
        });
        router.push("/payments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [params.id, form, router]);

  // Fetch patients


  // Fetch appointments when patient changes
  useEffect(() => {
      const fetchPatients = async () => {
        try {
          const result = await getPatients();
          setPatients(result.data);
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      };
    const fetchAppointments = async () => {
      if (!selectedPatientId) {
        setAppointments([]);
        return;
      }

      try {
       const result =await getAppointmentPayments(selectedPatientId)
       setAppointments(result?.data)
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    
    fetchPatients();

    fetchAppointments();
  }, [selectedPatientId]);

  // Update appointments when patient changes
  const handlePatientChange = (value: string) => {
    form.setValue("patientId", value);
    form.setValue("appointmentId", ""); // Reset appointment when patient changes
    setSelectedPatientId(value);
  };

  async function onSubmit(data: PaymentFormValues) {
    try {
      setIsSubmitting(true);
      const result = await updatePayment(params.id, data);

      if (result.success) {
      toast("Success", {
        description: "Payment updated successfully"
        // variant: "success",
      });

        if (data.appointmentId) {
          router.push(`/appointments/${data.appointmentId}`);
        } else if (data.patientId) {
          router.push(`/patients/${data.patientId}`);
        } else {
          router.push("/payments");
        }
      } else {
        toast.error("Error", {
        //   title: "Error",
          description: Array.isArray(result.error)
            ? result.error.map((err) => err.message).join(", ")
            : result.error || "Failed to update payment",
        //   variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Error", {
        description: "Failed to update payment. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
     
      
    );
  }

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Link href="/payments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Payment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>Update payment details.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select
                      onValueChange={handlePatientChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients?.map((patient) => (
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedPatientId}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an appointment" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No appointment</SelectItem>
                        {appointments?.map((appointment) => (
                          <SelectItem
                            key={appointment._id}
                            value={appointment._id}
                          >
                            {new Date(appointment.date).toLocaleDateString()} -
                            ${appointment.totalAmount}
                            {appointment.balance > 0
                              ? ` (Balance: ${appointment?.balance.toFixed(2)})`
                              : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>
                      Link this payment to a specific appointment.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="G-Pay">G-Pay</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            </CardContent>
            <CardFooter className="flex justify-between mt-4">
              <Link href="/payments">
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

export default function EditPayment({ params }: { params: { id: string } }) {
    return <DashboardLayout>
        <EditPaymentPage params={params} />
    </DashboardLayout>
}
