import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, DollarSign } from "lucide-react";
// import { RecentPatients } from "@/components/recent-patients";
// import { UpcomingAppointments } from "@/components/upcoming-appointments";
// import { WaitingList } from "@/components/waiting-list";
import { getPatients, getWaitingPatients } from "@/lib/actions/patient-actions";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTodayAppointments, getUpcomingAppointments } from "@/lib/actions/appointment-actions";
import RevenueChart from "@/components/RevenueChartDashboard";
async function Dashboard() {
  // Fetch data for dashboard metrics
  const [patientsResult, todayAppointmentsResult, upcomingAppointmentsResult] =
    await Promise.all([
      getPatients(),
      getTodayAppointments(),
      getUpcomingAppointments(),
    ]);

  const totalPatients = patientsResult.success ? patientsResult.data.length : 0;
  const newPatientsLastMonth = patientsResult.success
    ? patientsResult.data.filter((p:any) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(p.createdAt) >= oneMonthAgo;
      }).length
    : 0;

  const todayAppointments = todayAppointmentsResult.success
    ? todayAppointmentsResult.data.length
    : 0;
  const completedAppointments = todayAppointmentsResult.success
    ? todayAppointmentsResult.data.filter((a:any) => a.status === "Completed")
        .length
    : 0;

  // Calculate revenue (simplified for demo)
  interface Appointment {
    status: string;
    paidAmount: number | null;
    createdAt: string;
  }

  interface AppointmentResult {
    success: boolean;
    data: Appointment[];
  }

  interface Patient {
    createdAt: string;
  }

  interface PatientResult {
    success: boolean;
    data: Patient[];
  }

  const totalRevenue: number = todayAppointmentsResult.success
    ? todayAppointmentsResult.data.reduce(
        (sum: number, appointment: Appointment) => sum + (appointment.paidAmount || 0),
        0
      )
    : 0;

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/patients/new">
            <Button>New Patient</Button>
          </Link>
          <Link href="/appointments/new">
            <Button variant="outline">New Appointment</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              {newPatientsLastMonth} new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newPatientsLastMonth}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((newPatientsLastMonth / (totalPatients || 1)) * 100)}%
              of total patients
            </p>
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
            <div className="text-2xl font-bold">{todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {completedAppointments} completed,{" "}
              {todayAppointments - completedAppointments} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {completedAppointments} completed appointments
            </p>
          </CardContent>
        </Card>
      </div>

      <RevenueChart/>
{/* 
      <Tabs defaultValue="waiting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
          <TabsTrigger value="recent">Recent Patients</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="waiting" className="space-y-4">
          <WaitingList />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <RecentPatients />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <UpcomingAppointments />
        </TabsContent>
      </Tabs> */}
    </div>
    </PageContainer>
  );
}

export default function DashboardPage() {
  return <DashboardLayout>
    <Dashboard/>
  </DashboardLayout>
}