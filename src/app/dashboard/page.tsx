"use client"
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  Activity,
  Thermometer,
  Calendar as CalendarIcon,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {  useUser } from "@clerk/nextjs";
// import { DatePicker } from "@/components/ui/date-picker";

function Dashboard() {
  const [filterPeriod, setFilterPeriod] = useState("today");

  const {user}=useUser();
  console.log(user?.organizationMemberships[0].role?.split(":")[1],"heyhey")


  // Mock data for analytics
  const analyticsData = {
    today: {
      totalPatients: 12,
      newPatients: 3,
      completedAppointments: 8,
      revenue: 1450,
      cancellations: 1,
    },
    week: {
      totalPatients: 68,
      newPatients: 15,
      completedAppointments: 52,
      revenue: 8750,
      cancellations: 4,
    },
    month: {
      totalPatients: 284,
      newPatients: 42,
      completedAppointments: 231,
      revenue: 37500,
      cancellations: 18,
    },
  };

  // Recent patients data
  const recentPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      photo: "/api/placeholder/40/40",
      appointment: "10:30 AM",
      procedure: "Dental Cleaning",
      status: "completed",
      doctor: "Dr. Wilson",
    },
    {
      id: 2,
      name: "Robert Chen",
      photo: "/api/placeholder/40/40",
      appointment: "11:45 AM",
      procedure: "Root Canal",
      status: "in-progress",
      doctor: "Dr. Garcia",
    },
    {
      id: 3,
      name: "Emma Davis",
      photo: "/api/placeholder/40/40",
      appointment: "1:15 PM",
      procedure: "Orthodontic Adjustment",
      status: "scheduled",
      doctor: "Dr. Patel",
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      photo: "/api/placeholder/40/40",
      appointment: "2:30 PM",
      procedure: "Wisdom Tooth Extraction",
      status: "scheduled",
      doctor: "Dr. Wilson",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      photo: "/api/placeholder/40/40",
      appointment: "9:15 AM",
      procedure: "Dental Implant Consultation",
      status: "cancelled",
      doctor: "Dr. Garcia",
    },
  ];

  // Upcoming appointments data
  const upcomingAppointments = [
    { time: "3:45 PM", patient: "David Williams", procedure: "Tooth Filling" },
    { time: "4:30 PM", patient: "Jennifer Taylor", procedure: "Dental X-ray" },
    { time: "5:15 PM", patient: "Mark Anderson", procedure: "Follow-up Check" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        <main className="container mx-auto py-6 px-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Dashboard Overview
              </h2>

              {/* Analytics Filter */}
              <div className="">
                {/* <Tabs defaultValue="today" onValueChange={setFilterPeriod}>
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
              </Tabs> */}
                <Select
                  value={filterPeriod}
                  onValueChange={(value) => {
                     setFilterPeriod(value);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                      {/* <SelectItem value="yearly">Yearly</SelectItem> */}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    Total Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      {analyticsData[filterPeriod].totalPatients}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                    +5% from previous period
                  </span>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    New Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      {analyticsData[filterPeriod].newPatients}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                    +2% from previous period
                  </span>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Activity className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      {analyticsData[filterPeriod].completedAppointments}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                    +8% from previous period
                  </span>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <DollarSign className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      ${analyticsData[filterPeriod].revenue}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                    +12% from previous period
                  </span>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">
                    Cancellations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Thermometer className="h-6 w-6 text-primary mr-2" />
                    <span className="text-2xl font-bold">
                      {analyticsData[filterPeriod].cancellations}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1 text-red-500 rotate-180" />
                    -3% from previous period
                  </span>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Patient Records & Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>
                    Overview of the latest patient activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Procedure</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={patient.photo} />
                                <AvatarFallback>
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              {patient.name}
                            </div>
                          </TableCell>
                          <TableCell>{patient.appointment}</TableCell>
                          <TableCell>{patient.procedure}</TableCell>
                          <TableCell>{patient.doctor}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(patient.status)}>
                              {patient.status.charAt(0).toUpperCase() +
                                patient.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Today's remaining schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appt, i) => (
                      <div
                        key={i}
                        className="flex items-start p-3 rounded-lg border"
                      >
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {appt.time} - {appt.patient}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appt.procedure}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule New Appointment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
export default function DashboardPage() {
    return <DashboardLayout>
        <Dashboard />
    </DashboardLayout>
}