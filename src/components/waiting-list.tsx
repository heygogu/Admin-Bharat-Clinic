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
import { updatePatientWaitingStatus } from "@/lib/actions/patient-actions";
import { toast } from "sonner";
import { useState } from "react";

interface WaitingListProps {
  patients: any[];
}

export function WaitingList({ patients = [] }: WaitingListProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleCallPatient = async (patientId: string) => {
    setProcessingIds((prev) => new Set(prev).add(patientId));

    try {
      const result = await updatePatientWaitingStatus(patientId, false);

      if (result.success) {
        toast("Patient called",{
    
          description: "Patient has been removed from the waiting list.",
        });
      } else {
        toast.error("Error", {
          description: result.error || "Failed to call patient",
          // variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error calling patient:", error);
      toast("Error",{
        // title: 
        description: "Failed to call patient. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(patientId);
        return newSet;
      });
    }
  };

  // Calculate waiting time
  const getWaitingTime = (waitingSince: string) => {
    const waitingTime = new Date().getTime() - new Date(waitingSince).getTime();
    const minutes = Math.floor(waitingTime / (1000 * 60));

    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr ${remainingMinutes} min`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiting List</CardTitle>
        <CardDescription>
          {patients.length} patients currently waiting
        </CardDescription>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No patients currently waiting.
          </div>
        ) : (
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
              {patients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {patient.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      patient.waitingStatus.waitingSince
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {getWaitingTime(patient.waitingStatus.waitingSince)}
                    </div>
                  </TableCell>
                  <TableCell>{patient.waitingStatus.reason}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleCallPatient(patient._id)}
                      disabled={processingIds.has(patient._id)}
                    >
                      {processingIds.has(patient._id)
                        ? "Processing..."
                        : "Call Patient"}
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
