"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateAppointmentStatus } from "@/lib/actions/appointment-actions";
import { cn } from "@/lib/utils";

const statuses = [
  { value: "Scheduled", label: "Scheduled" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "No-Show", label: "No-Show" },
];

interface AppointmentStatusDropdownProps {
  appointmentId: string;
  currentStatus: string;
}

export function AppointmentStatusDropdown({
  appointmentId,
  currentStatus,
}: AppointmentStatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleSelect = async (value: string) => {
    if (value === status) {
      setOpen(false);
      return;
    }

    setUpdating(true);
    try {
      const result = await updateAppointmentStatus(appointmentId, value);
      if (result.success) {
        setStatus(value);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={updating}
          className="w-40 justify-between"
        >
          {status}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Command>
          <CommandEmpty>No status found.</CommandEmpty>
          <CommandGroup>
            {statuses.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => handleSelect(item.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    status === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
