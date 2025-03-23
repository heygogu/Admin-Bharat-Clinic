"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Save } from "lucide-react";
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
      [name]: parseFloat(value) || 0,
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
        <PageContainer>
          <div className="flex justify-center items-center min-h-96">
            <p>Loading appointment details...</p>
          </div>
        </PageContainer>
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
                    <Label htmlFor="date">Appointment Date</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Appointment Time</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <Separator />

                {/* Diagnosis and Treatment */}
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment</Label>
                  <Textarea
                    id="treatment"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <Separator />

                {/* Follow-up Date and Handled By */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      name="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="handledBy">Handled By</Label>
                    <Input
                      id="handledBy"
                      name="handledBy"
                      value={formData.handledBy}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Separator />

                {/* Total Amount */}
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                  <Input
                    id="totalAmount"
                    name="totalAmount"
                    type="number"
                    value={formData.totalAmount}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
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
