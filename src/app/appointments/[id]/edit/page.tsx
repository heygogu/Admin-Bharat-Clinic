"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Loader, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAppointmentById,
  updateAppointmentDetails,
} from "@/lib/actions/appointment-actions";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function EditAppointmentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    diagnosis: "",
    treatment: "",
    followUpDate: "",
    totalAmount: 0,
    handledBy: "",
    notes: "",
  });

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const result = await getAppointmentById(params.id);
        if (result.success) {
          setAppointment(result.data);

          // Format date for the input field (YYYY-MM-DD)
          const formattedDate = format(
            new Date(result.data.date),
            "yyyy-MM-dd"
          );
          const formattedFollowUpDate = result.data.followUpDate
            ? format(new Date(result.data.followUpDate), "yyyy-MM-dd")
            : "";

          setFormData({
            date: formattedDate,
            time: result.data.time || "",
            reason: result.data.reason || "",
            diagnosis: result.data.diagnosis || "",
            treatment: result.data.treatment || "",
            followUpDate: formattedFollowUpDate,
            totalAmount: result.data.totalAmount || 0,
            handledBy: result.data.handledBy || "",
            notes: result.data.notes || "",
          });
        } else {
          setError("Failed to load appointment");
        }
      } catch (err) {
        setError("An error occurred while loading the appointment");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointment();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await updateAppointmentDetails(params.id, {
        date: new Date(formData.date),
        time: formData.time,
        reason: formData.reason,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        followUpDate: formData.followUpDate
          ? new Date(formData.followUpDate)
          : undefined,
        totalAmount: formData.totalAmount,
        handledBy: formData.handledBy,
        notes: formData.notes,
      });

      if (result.success) {
        router.push(`/appointments/${params.id}`);
      } else {
        setError(result.error||null);
        setSaving(false);
      }
    } catch (err) {
      setError("An error occurred while saving the appointment");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader className="w-7 h-7 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !appointment) {
    return (
      <DashboardLayout>
        <PageContainer>
          <div className="flex justify-center items-center min-h-96">
            <p className="text-destructive">{error}</p>
          </div>
        </PageContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Link href={`/appointments/${params.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold md:text-3xl">
              Edit Appointment #{appointment?.serialNumber}
            </h1>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>
                  Update the details of this appointment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Date and Time */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Appointment Date <span className="text-red-400">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${
                            !formData.date && "text-muted-foreground"
                          }`}
                        >
                          {formData.date ? (
                            format(new Date(formData.date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={
                            formData.date ? new Date(formData.date) : undefined
                          }
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              date: date ? format(date, "yyyy-MM-dd") : "",
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">
                      Appointment Time<span className="text-red-400">*</span>
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("time", value)
                      }
                      value={formData.time}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                        <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                        <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                        <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                        <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                        <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                        <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                        <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                        <SelectItem value="01:00 PM">01:00 PM</SelectItem>
                        <SelectItem value="01:30 PM">01:30 PM</SelectItem>
                        <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                        <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                        <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                        <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                        <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                        <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="space-y-2">
                  <Label htmlFor="reason">
                    Reason for Visit<span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <Separator />

                {/* Diagnosis and Treatment */}
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">
                    Diagnosis<span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    required
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">
                    Treatment<span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="treatment"
                    name="treatment"
                    required
                    value={formData.treatment}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <Separator />

                {/* Follow-up Date and Handled By */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">
                      Follow-up Date<span className="text-red-400">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal ${
                            !formData.followUpDate && "text-muted-foreground"
                          }`}
                        >
                          {formData.followUpDate ? (
                            format(new Date(formData.followUpDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={
                            formData.followUpDate
                              ? new Date(formData.followUpDate)
                              : undefined
                          }
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              followUpDate: date
                                ? format(date, "yyyy-MM-dd")
                                : "",
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="handledBy">
                      Handled By<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="handledBy"
                      name="handledBy"
                      required
                      value={formData.handledBy}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Separator />

                {/* Total Amount */}
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">
                    Total Amount (₹)<span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    required
                    value={formData.totalAmount}
                    onChange={handleNumberChange}
                    min={0}
                    step="0.01"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-2">
                <Link href={`/appointments/${params.id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </PageContainer>
    </DashboardLayout>
  );
}
