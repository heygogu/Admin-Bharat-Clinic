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
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, FileEdit, Plus } from "lucide-react";
import Link from "next/link";
import { getAppointments } from "@/lib/actions/appointment-actions";
import { AppointmentDeleteButton } from "@/components/appointment-delete-button";
import { AppointmentSearchForm } from "@/components/appointment-search-form";
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
function formatAppointmentDate(dateString:string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";
  const result = await getAppointments();

  // Filter appointments based on search query if provided
  const appointments = result.success
    ? result.data.filter((appointment: any) =>
        query
          ? appointment.patientDetails.name
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            appointment.reason.toLowerCase().includes(query.toLowerCase()) ||
            appointment.serialNumber.toString().includes(query)
          : true
      )
    : [];

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <Link href="/appointments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Schedule</CardTitle>
            <CardDescription className="mb-4">
              Manage and view all appointments in the system.
            </CardDescription>
            <AppointmentSearchForm defaultValue={query} />
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No appointments found.{" "}
                  {query && "Try a different search term."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment: any) => (
                    <TableRow key={appointment._id}>
                      <TableCell className="font-medium">
                        {appointment.serialNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {appointment.patientDetails.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {appointment.patientDetails.age} /{" "}
                            {appointment.patientDetails.gender}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatAppointmentDate(appointment.date)}</span>
                          <span className="text-xs text-muted-foreground">
                            {appointment.time} ({appointment.day})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {appointment.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(appointment.status)}
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>₹{appointment.totalAmount}</span>
                          {appointment.balance > 0 && (
                            <span className="text-xs text-destructive">
                              Due: ₹{appointment.balance}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/appointments/${appointment._id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/appointments/${appointment._id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AppointmentDeleteButton
                            id={appointment._id}
                            serialNumber={appointment.serialNumber}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function Appointments({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return (
    <DashboardLayout>
      <AppointmentsPage searchParams={searchParams} />
    </DashboardLayout>
  );
}
