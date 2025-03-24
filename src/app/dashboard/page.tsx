import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, DollarSign } from "lucide-react";
import { RecentPatients } from "@/components/recent-patients";
import { UpcomingAppointments } from "@/components/upcoming-appointments";
import { WaitingList } from "@/components/waiting-list";
import { getWaitingPatients } from "@/lib/actions/patient-actions";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";
async function Dashboard() {
  const waitingPatientsResponse = await getWaitingPatients();
  const waitingPatients = waitingPatientsResponse.success ? waitingPatientsResponse.data : [];

  return (
    
    <PageContainer>

    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 completed, 9 pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,325</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
          {/* <WaitingList patients={waitingPatients} /> */}
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="waiting" className="space-y-4">
          <WaitingList patients={waitingPatients} />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentPatients />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingAppointments appointments={[]} />
        </TabsContent>
      </Tabs>
    </div>
    </PageContainer>
  );
}

export default function DashboardPage() {
  return <DashboardLayout>
    <Dashboard/>
  </DashboardLayout>
}