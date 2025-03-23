"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
toast
import { deletePatient } from "@/lib/actions/patient-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface PatientDeleteButtonProps {
  id: string
  name: string
}

export function PatientDeleteButton({ id, name }: PatientDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      const result = await deletePatient(id)

      if (result.success) {
        toast("Patient deleted",{
          
          description: `${name} has been removed from the system.`,
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to delete patient",
       
        });
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
      toast.error("Error",{
        
        description: "Failed to delete patient. Please try again.",
        
      })
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Patient</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {name}? This action cannot be undone and will remove all associated records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

