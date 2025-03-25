"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Patient columns
export const patientColumns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <span>
          {gender === "M" ? "Male" : gender === "F" ? "Female" : "Other"}
        </span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return <div className="max-w-[200px] truncate">{address}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/patients/${patient._id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/patients/${patient._id}/edit`}>Edit patient</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/appointments/new?patientId=${patient._id}`}>
                New appointment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/prescriptions/new?patientId=${patient._id}`}>
                New prescription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/lab-results/new?patientId=${patient._id}`}>
                New lab result
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Appointment columns
export const appointmentColumns: ColumnDef<any>[] = [
  {
    accessorKey: "Appointment ID",
    header: "Appointment ID",
    cell: ({ row }) => {
      const serialNumber = row.original.serialNumber as string;
      return <span>{serialNumber}</span>;
    },
  },
  {
    accessorKey: "Patient",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patientDetails;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{patient.name}</span>
          <span className="text-xs text-muted-foreground">
            {patient.age} / {patient.gender}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date/Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="flex flex-col">
          <span>{date.toLocaleDateString()}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.time} ({row.original.day})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string;
      return <div className="max-w-[200px] truncate">{reason}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const getStatusBadgeVariant = (status: string) => {
        switch (status) {
          case "Scheduled":
            return "outline";
          case "In Progress":
            return "secondary";
          case "Completed":
            return "default";
          case "Cancelled":
          case "No-Show":
            return "destructive";
          default:
            return "outline";
        }
      };

      return <Badge variant={getStatusBadgeVariant(status)}>{status}</Badge>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Payment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex flex-col">
          <span>₹{appointment.totalAmount}</span>
          {appointment.balance > 0 && (
            <span className="text-xs text-destructive">
              Due: ₹{appointment.balance?.toFixed(2)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/appointments/${appointment._id}`}>
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/appointments/${appointment._id}/edit`}>
                Edit appointment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/patients/${appointment.patient}`}>
                View patient
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Payment columns
export const paymentColumns: ColumnDef<any>[] = [
  {
    accessorKey: "patient.name",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {patient?.name
                ?.split(" ")
                .map((n:any) => n[0])
                .join("") || "P"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{patient?.name || "Unknown"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <span className="font-medium">{formatted}</span>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "method",
    header: "Method",
    cell: ({ row }) => {
      const method = row.getValue("method") as string;
      return <Badge variant="outline">{method}</Badge>;
    },
  },
  {
    accessorKey: "appointment",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original.appointment;
      return appointment ? (
        <Link
          href={`/appointments/${appointment._id}`}
          className="text-primary hover:underline"
        >
          View appointment
        </Link>
      ) : (
        <span className="text-muted-foreground">No appointment</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/payments/${payment._id}/edit`}>Edit payment</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/patients/${payment.patient._id}`}>
                View patient
              </Link>
            </DropdownMenuItem>
            {payment.appointment && (
              <DropdownMenuItem asChild>
                <Link href={`/appointments/${payment.appointment._id}`}>
                  View appointment
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Lab Result columns
export const labResultColumns: ColumnDef<any>[] = [
  {
    accessorKey: "patient.name",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {patient?.name
                ?.split(" ")
                .map((n:any) => n[0])
                .join("") || "P"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{patient?.name || "Unknown"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <Badge variant="outline">{type}</Badge>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") as string;
      return <div className="max-w-[200px] truncate">{details}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const labResult = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/lab-results/${labResult._id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/lab-results/${labResult._id}/edit`}>
                Edit lab result
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/patients/${labResult.patient._id}`}>
                View patient
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Prescription columns
export const prescriptionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "patient.name",
    header: "Patient",
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {patient?.name
                ?.split(" ")
                .map((n:any) => n[0])
                .join("") || "P"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{patient?.name || "Unknown"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "medications",
    header: "Medications",
    cell: ({ row }) => {
      const medications = row.getValue("medications") as any[];
      return (
        <div className="max-w-[200px] truncate">
          {medications.map((med) => med.name).join(", ")}
        </div>
      );
    },
  },
  {
    accessorKey: "prescribedBy",
    header: "Prescribed By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const prescription = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/prescriptions/${prescription._id}`}>
                View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/prescriptions/${prescription._id}/edit`}>
                Edit prescription
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/patients/${prescription.patient._id}`}>
                View patient
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
