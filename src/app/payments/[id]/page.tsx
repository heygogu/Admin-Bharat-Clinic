"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getPaymentById, deletePayment } from "@/lib/actions/payment-actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";

function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [payment, setPayment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setIsLoading(true);
        const result = await getPaymentById(id);

        if (result.success) {
          setPayment(result.data);
        } else {
          console.error("Failed to fetch payment:", result.error);
          toast("Error", {
            description: "Failed to load payment details",
          });
        }
      } catch (error) {
        console.error("Error fetching payment:", error);
        toast("Error", {
          description: "Failed to load payment details",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPayment();
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deletePayment(id);

      if (result.success) {
        toast("Payment deleted", {
          description: "The payment has been successfully deleted.",
        });
        router.push("/payments");
      } else {
        toast("Error", {
          description: result.error || "Failed to delete payment",
        });
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast("Error", {
        description: "Failed to delete payment",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-8">
          Loading payment details...
        </div>
      </PageContainer>
    );
  }

  if (!payment) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center py-8">
          <h2 className="text-xl font-semibold mb-2">Payment not found</h2>
          <p className="mb-4">
            The payment you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/payments">
            <Button>Return to Payments</Button>
          </Link>
        </div>
      </PageContainer>
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
          <h1 className="text-3xl font-bold tracking-tight">Payment Details</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>
              View details for payment made on{" "}
              {new Date(payment.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Patient
                </h3>
                <p className="text-lg">
                  <Link
                    href={`/patients/${payment.patient._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {payment.patient.name}
                  </Link>
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Date
                </h3>
                <p className="text-lg">
                  {new Date(payment.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Amount
                </h3>
                <p className="text-lg font-semibold">
                  ${payment.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Payment Method
                </h3>
                <p className="text-lg">{payment.method}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Appointment
                </h3>
                <p className="text-lg">
                  {payment.appointment ? (
                    <Link
                      href={`/appointments/${payment.appointment._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {new Date(payment.appointment.date).toLocaleDateString()}{" "}
                      (#{payment.appointment.serialNumber})
                    </Link>
                  ) : (
                    "No associated appointment"
                  )}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Created
                </h3>
                <p className="text-lg">
                  {new Date(payment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {payment.notes && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Notes
                </h3>
                <p className="text-lg">{payment.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/payments">
              <Button variant="outline">Return to Payments</Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  <Trash className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting..." : "Delete Payment"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the payment record of $
                    {payment.amount.toFixed(2)} made on{" "}
                    {new Date(payment.date).toLocaleDateString()}.
                    {payment.appointment &&
                      " This will also reduce the paid amount for the associated appointment."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function PaymentDetails() {
  return (
    <DashboardLayout>
      <PaymentDetailsPage />
    </DashboardLayout>
  );
}
