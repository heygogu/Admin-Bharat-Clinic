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
import Link from "next/link";
import { updateAppointmentStatus } from "@/lib/actions/appointment-actions";
import { toast } from "sonner";
import { useState } from "react";

interface UpcomingAppointmentsProps {
  appointments: any[];
}

export function UpcomingAppointments({
  appointments = [],
}: UpcomingAppointmentsProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleCheckIn = async (appointmentId: string) => {
    setProcessingIds((prev) => new Set(prev).add(appointmentId));

    try {
      const result = await updateAppointmentStatus(
        appointmentId,
        "In Progress"
      );

      if (result.success) {
        toast("Appointment updated", {
          description: "Patient has been checked in.",
        });
      } else {
        toast.error( "Error",{
          // title:
          description: result.error || "Failed to check in patient",
          // variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking in patient:", error);
      toast.error("Error", {
        description: "Failed to check in patient. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(appointmentId);
        return newSet;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>
          You have {appointments.length} upcoming appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No upcoming appointments.
          </div>
        ) : (
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
              {appointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {appointment.patientDetails?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/patients/${appointment.patient}`}
                        className="hover:underline"
                      >
                        {appointment.patientDetails?.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(appointment.date).toLocaleDateString()}
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
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(appointment._id)}
                      disabled={
                        processingIds.has(appointment._id) ||
                        appointment.status !== "Scheduled"
                      }
                    >
                      {processingIds.has(appointment._id)
                        ? "Processing..."
                        : "Check In"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
