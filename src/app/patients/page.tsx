import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, FileEdit, Plus } from "lucide-react"
import Link from "next/link"
import { getPatients } from "@/lib/actions/patient-actions"
import { PatientDeleteButton } from "@/components/patient-delete-button"
import { PatientSearchForm } from "@/components/patient-search-form"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"

async function PatientsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  
  const query = searchParams.q || ""
  const result = await getPatients()

  // Filter patients based on search query if provided
  const patients = result.success
    ? result.data.filter((patient:any) => (query ? patient.name.toLowerCase().includes(query.toLowerCase()) : true))
    : []

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
          <CardDescription>Manage and view all patient records in the system.</CardDescription>
          <PatientSearchForm defaultValue={query} />
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No patients found. {query && "Try a different search term."}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient:any) => (
                  <TableRow key={patient._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {patient.name
                              .split(" ")
                              .map((n:any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {patient.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.age} / {patient.gender}
                    </TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{patient.address}</TableCell>
                    <TableCell>{new Date(patient.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/patients/${patient._id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient._id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <PatientDeleteButton id={patient._id} name={patient.name} />
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
  )
}

export default function Patients({ searchParams }: { searchParams: { q?: string } }) {
  return <DashboardLayout>
    <PatientsPage 
      searchParams={searchParams}
    />
  </DashboardLayout>
}