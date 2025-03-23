"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Define schema for payment form
const paymentFormSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, { message: "Amount must be greater than 0" }),
  method: z.string().min(1, { message: "Payment method is required" }),
  notes: z.string().optional(),
});

export function PaymentForm({
  onSubmit,
  maxAmount,
  appointmentId,
  patientId,
}: {
  onSubmit: (formData: FormData) => Promise<any>;
  maxAmount: number;
  appointmentId: string;
  patientId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: maxAmount,
      method: "Cash",
      notes: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof paymentFormSchema>) {
    setIsSubmitting(true);

    // Create FormData object to pass to server action
    const formData = new FormData();
    formData.append("amount", values.amount.toString());
    formData.append("method", values.method);
    formData.append("notes", values.notes || "");
    formData.append("appointmentId", appointmentId);
    formData.append("patientId", patientId);

    try {
      const result = await onSubmit(formData);

      if (result.success) {
        toast( "Payment recorded",{
        
          description: `₹${values.amount} payment has been successfully recorded.`,
        });

        // Reset form
        form.reset();

        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error("Error",{
         
          description: result.error || "Failed to record payment",
          
        });
      }
    } catch (error) {
      toast("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-1">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="1"
                    max={maxAmount}
                    {...field}
                    onChange={(e) => {
                      // Ensure value doesn't exceed the max balance
                      const val = parseFloat(e.target.value);
                      if (val > maxAmount) {
                        field.onChange(maxAmount);
                      } else {
                        field.onChange(e);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>Maximum allowed: ₹{maxAmount}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="G-Pay">G-Pay</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional details about this payment"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
