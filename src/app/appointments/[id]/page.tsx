import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getAppointmentById,
  updateAppointmentStatus,
} from "@/lib/actions/appointment-actions";
import { AppointmentDeleteButton } from "@/components/appointment-delete-button";
import { AppointmentStatusDropdown } from "@/components/appointment-status-dropdown";
import { PaymentList } from "@/components/payment-list";
import { LabResultList } from "@/components/lab-result-list";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";

// Helper function to get status badge variant
function getStatusBadgeVariant(status:string) {
  switch (status) {
    case "Scheduled":
      return "outline";
    case "In Progress":
      return "secondary";
    case "Completed":
      return "default";
    case "Cancelled":
      return "destructive";
    case "No-Show":
      return "destructive";
    default:
      return "outline";
  }
}

// Format date for display
function formatDate(dateString:string) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function AppointmentDetailPage({ params }: { params: { id: string } }) {

  const {id}=await params;
  const result = await getAppointmentById(id);
  // const result = await getAppointmentById(params.id);

  if (!result.success) {
    notFound();
  }

  const appointment = result.data;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Header with navigation and actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Link href="/appointments">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold md:text-3xl">
              Appointment #{appointment.serialNumber}
            </h1>
            <Badge variant={getStatusBadgeVariant(appointment.status)}>
              {appointment.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <AppointmentStatusDropdown
              appointmentId={appointment?._id}
              currentStatus={appointment?.status}
            />
            <Link href={`/appointments/${appointment._id}/edit`}>
              <Button>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            {/* <AppointmentDeleteButton
              id={appointment._id}
              serialNumber={appointment.serialNumber}
            /> */}
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Appointment Info Column */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                  Complete information about this appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Date and Time Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start gap-4">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                      <div className="grid gap-1">
                        <h3 className="text-xl font-medium">
                          {formatDate(appointment.date)}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {appointment.time} ({appointment.day})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 font-medium">Reason for Visit</h3>
                      <p className="text-muted-foreground">
                        {appointment.reason || "Not specified"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 font-medium">Diagnosis</h3>
                      <p className="text-muted-foreground">
                        {appointment.diagnosis || "Not recorded"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 font-medium">Treatment</h3>
                      <p className="text-muted-foreground">
                        {appointment.treatment || "Not recorded"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 font-medium">Notes</h3>
                      <p className="text-muted-foreground">
                        {appointment.notes || "No notes recorded"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 font-medium">Follow-up Date</h3>
                      <p className="text-muted-foreground">
                        {appointment.followUpDate
                          ? formatDate(appointment.followUpDate)
                          : "No follow-up scheduled"}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-2 font-medium">Handled By</h3>
                      <p className="text-muted-foreground">
                        {appointment.handledBy || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient and Payment Column */}
          <div className="space-y-6">
            {/* Patient Card */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {appointment.patientDetails.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="font-medium">
                        {appointment.patientDetails.age}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">
                        {appointment.patientDetails.gender}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="font-medium">
                      {appointment.patientDetails.phoneNumber}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">
                      {appointment.patientDetails.address}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link href={`/patients/${appointment.patient}`}>
                      <Button variant="outline" className="w-full">
                        View Patient Record
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Card */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">₹{appointment?.totalAmount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="font-medium text-green-400">₹{appointment?.paidAmount?.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Balance</p>
                      <p className="font-medium text-destructive">
                        ₹{appointment?.balance?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/appointments/${appointment._id}/payment`}>
                      <Button variant="outline" className="w-full">
                        Manage Payments
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for Payments and Lab Results */}
        <Tabs defaultValue="payments" className="w-full">
          <TabsList>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
          </TabsList>
          <TabsContent value="payments" className="p-1">
            <Card>
              <CardContent className="pt-6">
                <PaymentList payments={appointment.payments || []} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lab-results" className="p-1">
            <Card>
              <CardContent className="pt-6">
                <LabResultList labResults={appointment.labResults || []} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default function AppointmentDetail({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout>
      <AppointmentDetailPage params={params} />
    </DashboardLayout>
  );
}
