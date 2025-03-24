"use client";
import Link from "next/link";
import { ArrowLeft, Cross, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/page-container";

import { PaymentForm } from "@/components/payment-form";
import { useState } from "react";
// Format date for display
function formatDate(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Format date and time for payment history
function formatDateTime(dateString: string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export default function PaymentPageClient({
  appointment,
  handleAddPayment,
}: {
  appointment: any;
  handleAddPayment: (formData: FormData) => Promise<any>;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header with navigation */}
        <div className="flex items-center gap-4">
          <Link href={`/appointments/${appointment._id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold md:text-3xl">Manage Payments</h1>
        </div>

        {/* Payment Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>
              For appointment #{appointment.serialNumber} -{" "}
              {formatDate(appointment.date)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </h3>
                <p className="text-2xl font-bold">₹{appointment.totalAmount}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Paid Amount
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{appointment?.paidAmount}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Balance
                </h3>
                <p className="text-2xl font-bold text-destructive">
                  ₹{appointment.balance?.toFixed(2)}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Patient Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-medium">Patient</h3>
                <p>{appointment.patientDetails.name}</p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Phone Number</h3>
                <p>{appointment.patientDetails.phoneNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Payment */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Add Payment</CardTitle>
              <CardDescription>
                Record a new payment for this appointment
              </CardDescription>
            </div>
            <Button
              variant={showForm ? "secondary" : "default"}
              onClick={() => setShowForm(!showForm)}
            >
             {showForm? <X className="mr-2 h-4 w-4"/>: <Plus className="mr-2 h-4 w-4" />}
              {showForm ? "Cancel" : "New Payment"}
            </Button>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <PaymentForm
                onSubmit={handleAddPayment}
                maxAmount={appointment.balance}
                appointmentId={appointment._id}
                patientId={appointment.patient}
              />
            ) : appointment.balance === 0 ? (
              <Alert>
                <AlertTitle>Fully Paid</AlertTitle>
                <AlertDescription>
                  This appointment has been fully paid. No balance remaining.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex justify-center py-6">
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Record New Payment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              All payments recorded for this appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointment.payments && appointment.payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointment.payments.map((payment: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{formatDateTime(payment.date)}</TableCell>
                      <TableCell className="font-medium">
                        ₹{payment.amount}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No payment records found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
