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
import { Eye, FileEdit } from "lucide-react";
import Link from "next/link";

const recentPatients = [
  {
    id: "1",
    name: "John Doe",
    age: 45,
    gender: "M",
    phoneNumber: "+1 (555) 123-4567",
    lastVisit: "2023-03-20",
    status: "Completed",
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 32,
    gender: "F",
    phoneNumber: "+1 (555) 987-6543",
    lastVisit: "2023-03-19",
    status: "Pending Lab Results",
  },
  {
    id: "3",
    name: "Robert Johnson",
    age: 58,
    gender: "M",
    phoneNumber: "+1 (555) 456-7890",
    lastVisit: "2023-03-18",
    status: "Follow-up Scheduled",
  },
  {
    id: "4",
    name: "Emily Davis",
    age: 27,
    gender: "F",
    phoneNumber: "+1 (555) 789-0123",
    lastVisit: "2023-03-17",
    status: "Completed",
  },
  {
    id: "5",
    name: "Michael Wilson",
    age: 41,
    gender: "M",
    phoneNumber: "+1 (555) 234-5678",
    lastVisit: "2023-03-16",
    status: "Pending Payment",
  },
];

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
        <CardDescription>
          You have {recentPatients.length} recent patients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
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
                <TableCell>
                  {patient.age} / {patient.gender}
                </TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      patient.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : patient.status === "Pending Lab Results"
                        ? "bg-blue-100 text-blue-800"
                        : patient.status === "Follow-up Scheduled"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {patient.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/patients/${patient.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/patients/${patient.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <FileEdit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
