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
import { getPatients } from "@/lib/actions/patient-actions";
import { PatientSearchForm } from "@/components/patient-search-form";
import { DataTable } from "@/components/data-table/data-table";
import { patientColumns } from "@/components/data-table/columns";
import { Pagination } from "@/components/pagination";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

async function PatientsPage({
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

  const result = await getPatients();

  // Filter patients based on search query if provided
  const allPatients = result.success
    ? result.data.filter((patient:any) =>
        query ? patient.name.toLowerCase().includes(query.toLowerCase()) : true
      )
    : [];

  // Calculate pagination
  const totalPatients = allPatients.length;
  const totalPages = Math.ceil(totalPatients / ITEMS_PER_PAGE);

  if (page > totalPages && totalPages > 0) {
    notFound();
  }

  // Get current page patients
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const patients = allPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <Link href="/patients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>
            Manage and view all patient records in the system.
          </CardDescription>
          <PatientSearchForm defaultValue={query} />
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                No patients found. {query && "Try a different search term."}
              </p>
            </div>
          ) : (
            <>
              <DataTable columns={patientColumns} data={patients} />
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath="/patients/page"
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

export default function Patients(
    props: { params: { page: string }; searchParams: { q?: string } }
    ) {
    return <DashboardLayout>
        <PatientsPage {...props}/>
    </DashboardLayout>
}

