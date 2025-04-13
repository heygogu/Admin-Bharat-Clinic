import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/data-table/data-table";
import { appointmentColumns } from "@/components/data-table/columns";
import { Pagination } from "@/components/pagination";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";
import { getAppointments } from "@/lib/actions/appointment-actions";
import { AppointmentSearchForm } from "@/components/appointment-search-form";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

async function AppointmentsPageCompo({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams: { q?: string };
}) {
  const page = parseInt(params.page) || 1;
  const query = searchParams.q || "";

  if (isNaN(page) || page < 1) {
    notFound();
  }

  const result = await getAppointments();


  // Filter appointments based on search query if provided
  const allAppointments = result.success
    ? result.data.filter((appointment: any) =>
        query
          ? appointment.serialNumber
              .toString()
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            appointment.patientDetails.name
              .toLowerCase()
              .includes(query.toLowerCase()) ||
            appointment.reason.toLowerCase().includes(query.toLowerCase())
          : true
      )
    : [];

  // Calculate pagination
  const totalAppointments = allAppointments.length;
  const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

//   if (page > totalPages && totalPages > 0) {
//     notFound();
//   }

  // Get current page appointments
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const appointments = allAppointments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-4">
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
            <CardTitle>Appointment Records</CardTitle>
            <CardDescription>
              Manage and view all appointment records in the system.
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
              <>
                <DataTable columns={appointmentColumns} data={appointments} />
                <div className="mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    basePath="/appointments/page"
                    query={query ? `?q=${query}` : ""}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function Appointments(props: {
  params: { page: string };
  searchParams: { q?: string };
}) {
  return (
    <DashboardLayout>
      <AppointmentsPageCompo {...props} />
    </DashboardLayout>
  );
}
