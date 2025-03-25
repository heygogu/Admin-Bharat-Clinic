import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueReport } from "@/components/reports/revenue-report";
import { PatientReport } from "@/components/reports/patient-report";
// import { AppointmentReport } from "@/components/reports/appointment-report";
// import { DiagnosisReport } from "@/components/reports/diagnosis-report";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";

function ReportsPage() {
  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          {/* <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger> */}
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>
                Analyze revenue trends over time and by payment method.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueReport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
              <CardDescription>
                Analyze patient demographics and registration trends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PatientReport />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Analysis</CardTitle>
              <CardDescription>
                Analyze appointment trends and status distribution.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentReport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnosis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Distribution</CardTitle>
              <CardDescription>
                Analyze common diagnoses and treatments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DiagnosisReport />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
    </PageContainer>
  );
}

export default function Reports(){
    return <DashboardLayout>
        <ReportsPage/>
    </DashboardLayout>
}