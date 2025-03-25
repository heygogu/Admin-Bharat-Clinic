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
import { Clock } from "lucide-react";

const waitingPatients = [
  {
    id: "1",
    patientName: "John Doe",
    patientId: "1",
    waitingSince: "09:15 AM",
    waitingTime: "25 min",
    reason: "Follow-up",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    patientId: "2",
    waitingSince: "09:30 AM",
    waitingTime: "10 min",
    reason: "Consultation",
  },
  {
    id: "3",
    patientName: "Robert Johnson",
    patientId: "3",
    waitingSince: "09:45 AM",
    waitingTime: "5 min",
    reason: "Lab Results Review",
  },
];

export function WaitingList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiting List</CardTitle>
        <CardDescription>
          {waitingPatients.length} patients currently waiting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Waiting Since</TableHead>
              <TableHead>Waiting Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {waitingPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {patient.patientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {patient.patientName}
                  </div>
                </TableCell>
                <TableCell>{patient.waitingSince}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {patient.waitingTime}
                  </div>
                </TableCell>
                <TableCell>{patient.reason}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm">Call Patient</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
