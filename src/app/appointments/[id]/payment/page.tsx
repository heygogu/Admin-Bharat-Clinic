
import { notFound } from "next/navigation";

import {
  getAppointmentById,
  updateAppointmentDetails,
} from "@/lib/actions/appointment-actions";

import DashboardLayout from "@/components/dashboard-layout";
import PaymentPageClient from "@/components/AppointmentPayment";
import { createPayment } from "@/lib/actions/payment-actions";

type method = "Cash" | "G-Pay" | "Card" | "Other";


// Server component to fetch data
async function AppointmentPaymentPage({ params }: { params: { id: string } }) {
  const result = await getAppointmentById(params.id);

  if (!result.success) {
    notFound();
  }

  const appointment = result.data;

async function handleAddPayment(formData: FormData) {
  "use server";

  const amount = parseFloat(formData.get("amount") as string);
  const method = formData.get("method") as method; ;
  const notes = formData.get("notes") as string;



  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: "Invalid payment amount" };
  }

  // Get current appointment data
  const currentAppointment = await getAppointmentById(params.id);
  if (!currentAppointment.success) {
    return { success: false, error: "Appointment not found" };
  }

  const appointmentData = currentAppointment.data;

  // First create a payment record in the Payment collection
  const paymentResult = await createPayment({
    patientId: appointmentData.patient._id || appointmentData.patient,
    amount: amount,
    method: method,
    notes: notes,
    appointmentId: params.id,
  });

  if (!paymentResult.success) {
    return paymentResult; // Return error if payment creation failed
  }

  // The appointment will be updated automatically by the createPayment function
  // through the appointment.addPayment method, so we don't need to update it again

  return { success: true, data: paymentResult.data };
}

  return (
    <PaymentPageClient
      appointment={appointment}
      handleAddPayment={handleAddPayment}
    />
  );
}


export default function AppointmentPayment({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout>
      <AppointmentPaymentPage params={params} />
    </DashboardLayout>
  );
}
