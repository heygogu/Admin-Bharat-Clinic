import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, FileEdit, FilePlus, FlaskRoundIcon as Flask, Link2, User } from "lucide-react"
import Link from "next/link"
import { getPatientById } from "@/lib/actions/patient-actions"
import { getPatientAppointments } from "@/lib/actions/appointment-actions"
import { getPatientLabResults } from "@/lib/actions/lab-result-actions"
import { notFound } from "next/navigation"
import PageContainer from "@/components/page-container"
import DashboardLayout from "@/components/dashboard-layout"
import { getPatientPrescriptions } from "@/lib/actions/prescription-actions"

async function PatientDetailsPage({ params }: { params: { id: string } }) {

  const {id}=await params;
  const patientResult = await getPatientById(id)

  if (!patientResult.success || !patientResult.data) {
    notFound()
  }

  const patient = patientResult.data

  // Fetch related data
  const [appointmentsResult, prescriptionsResult, labResultsResult] = await Promise.all([
    getPatientAppointments(id),
    getPatientPrescriptions(id),
    getPatientLabResults(id),
  ])

  const appointments = appointmentsResult.success ? appointmentsResult.data : []
  const prescriptions = prescriptionsResult.success ? prescriptionsResult.data : []
  const labResults = labResultsResult.success ? labResultsResult.data : []
  console.log(prescriptions,"prescriptionsdata")

  return (
    <PageContainer>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <Link href="/patients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Patient Details</h1>
        </div>

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground">
                {patient.age} years •{" "}
                {patient.gender === "M"
                  ? "Male"
                  : patient.gender === "F"
                  ? "Female"
                  : "Other"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/patients/${id}/edit`}>
              <Button variant="outline">
                <FileEdit className="mr-2 h-4 w-4" />
                Edit Patient
              </Button>
            </Link>
            <Link href={`/appointments/new?patientId=${id}`}>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Phone Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.phoneNumber}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{patient.address}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Patient Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{new Date(patient.createdAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
            <CardDescription>
              Patient's reported medical history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{patient.medicalHistory || "No medical history recorded."}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="labResults">Lab Results</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Appointment History</h3>
              <Link href={`/appointments/new?patientId=${id}`}>
                <Button size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </Link>
            </div>

            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment:any) => (
                  <Card key={appointment._id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-medium">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.time}
                        </CardTitle>
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            appointment.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : appointment.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status}
                        </div>
                      </div>
                      <CardDescription>
                        {appointment.reason ||
                          appointment.diagnosis ||
                          "No diagnosis recorded"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {appointment.treatment && (
                          <div>
                            <span className="font-medium">Treatment: </span>
                            {appointment.treatment}
                          </div>
                        )}
                        {appointment.followUpDate && (
                          <div>
                            <span className="font-medium">Follow-up: </span>
                            {new Date(
                              appointment.followUpDate
                            ).toLocaleDateString()}
                          </div>
                        )}
                        {appointment.notes && (
                          <div>
                            <span className="font-medium">Notes: </span>
                            {appointment.notes}
                          </div>
                        )}
                        <div className="flex justify-between pt-2 text-sm">
                          <div>
                            <span className="font-medium">Total: </span>$
                            {appointment.totalAmount}
                          </div>
                          <div className="text-green-400">
                            <span className="font-medium ">Paid: </span>$
                            {appointment.paidAmount}
                          </div>
                          <div className="text-red-400">
                            <span className="font-medium">Balance: </span>$
                            {appointment.balance?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  No appointment history found.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Prescription History</h3>
              <Link href={`/prescriptions/new?patientId=${id}`}>
                <Button size="sm">
                  <FilePlus className="mr-2 h-4 w-4" />
                  New Prescription
                </Button>
              </Link>
            </div>

            {prescriptions.length > 0 ? (
              <div className="space-y-4">
                {prescriptions.map((prescription:any) => (
                  <Card key={prescription._id}>
                    <CardHeader className="">
                      <CardTitle className="text-base font-medium">
                        Prescription -{" "}
                        {new Date(prescription.date).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {prescription.medications.map((med:any , index:any) => (
                          <div key={index} className="p-3 bg-muted rounded-md flex justify-between items-center -mt-3">
                            <div>

                            <div className="font-medium">
                              {med.name} - {med.dosage}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {med.frequency} for {med.duration}
                            </div>
                            </div>
                            
                              <div>
                               <Link href={`/prescriptions/${prescription?._id}/edit`} passHref>
                                <Button variant="outline" size="sm" className="cursor-pointer">
                                  <FileEdit className="mr-1 h-4 w-4" />
                                  Edit
                                </Button>
                                </Link>
                              </div>
                          </div>
                        ))}
                        {prescription.notes && (
                          <div className="pt-2">
                            <span className="font-medium">Notes: </span>
                            {prescription.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  No prescription history found.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="labResults" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Lab Results</h3>
              <Link href={`/lab-results/new?patientId=${id}`}>
                <Button size="sm">
                  <Flask className="mr-2 h-4 w-4" />
                  New Lab Result
                </Button>
              </Link>
            </div>

            {labResults.length > 0 ? (
              <div className="space-y-4">
                {labResults.map((result:any) => (
                  <Card key={result._id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-medium">
                          {result.type}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {new Date(result.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Details: </span>
                          {result.details}
                        </div>
                        {result.notes && (
                          <div>
                            <span className="font-medium">Notes: </span>
                            {result.notes}
                          </div>
                        )}
                        {result.fileUrl && (
                          <div className="pt-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={result.fileUrl}>View Report</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  No lab results found.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default function PatientDetails({ params }: { params: { id: string } }) {
  return <DashboardLayout>
    <PatientDetailsPage params={params} />
  </DashboardLayout>
}

