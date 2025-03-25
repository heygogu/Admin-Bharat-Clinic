"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

const upcomingAppointments = [
  {
    id: "1",
    patientName: "John Doe",
    patientId: "1",
    date: "2023-03-25",
    time: "09:00 AM",
    reason: "Follow-up",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    patientId: "2",
    date: "2023-03-25",
    time: "10:30 AM",
    reason: "Consultation",
  },
  {
    id: "3",
    patientName: "Robert Johnson",
    patientId: "3",
    date: "2023-03-26",
    time: "11:15 AM",
    reason: "Lab Results Review",
  },
  {
    id: "4",
    patientName: "Emily Davis",
    patientId: "4",
    date: "2023-03-26",
    time: "02:00 PM",
    reason: "New Patient",
  },
  {
    id: "5",
    patientName: "Michael Wilson",
    patientId: "5",
    date: "2023-03-27",
    time: "09:45 AM",
    reason: "Follow-up",
  },
];

export function UpcomingAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          You have {upcomingAppointments.length} upcoming appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {appointment.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {appointment.patientName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {appointment.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {appointment.time}
                  </div>
                </TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm">Check In</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
