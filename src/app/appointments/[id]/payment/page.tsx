
import { notFound } from "next/navigation";

import {
  getAppointmentById,
  updateAppointmentDetails,
} from "@/lib/actions/appointment-actions";

import DashboardLayout from "@/components/dashboard-layout";
import PaymentPageClient from "@/components/AppointmentPayment";




// Server component to fetch data
async function AppointmentPaymentPage({ params }: { params: { id: string } }) {
  const result = await getAppointmentById(params.id);

  if (!result.success) {
    notFound();
  }

  const appointment = result.data;

  // Handle new payment submission from client component
  async function handleAddPayment(formData: FormData) {
    "use server";

    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
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

    // Add new payment to payments array
    const newPayment = {
      amount,
      method,
      notes,
      date: new Date(),
      patient: appointmentData.patient,
      appointment: appointmentData._id,
    };

    const updatedPayments = [...appointmentData.payments, newPayment];

    // Calculate new paid amount
    const newPaidAmount = appointmentData.paidAmount + amount;

    // Update the appointment with the new payment data
    const result = await updateAppointmentDetails(params.id, {
      payments: updatedPayments,
      paidAmount: newPaidAmount,
      // Balance will be auto-calculated in the pre-save hook
    });

    return result;
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
