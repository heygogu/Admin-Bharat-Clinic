"use client";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import {
  Save,
  Upload,
  User,
  Building,
  Bell,
  Shield,
  Database,
} from "lucide-react";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";

const clinicFormSchema = z.object({
  name: z.string().min(2, {
    message: "Clinic name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  logo: z.string().optional(),
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  appointmentReminders: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  newPatientNotifications: z.boolean().default(true),
  paymentNotifications: z.boolean().default(true),
});

const securityFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  sessionTimeout: z.number().min(5).max(60),
  passwordExpiry: z.number().min(30).max(365),
  ipRestriction: z.boolean().default(false),
  allowedIps: z.string().optional(),
});

const backupFormSchema = z.object({
  autoBackup: z.boolean().default(true),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]),
  backupTime: z.string(),
  retentionPeriod: z.number().min(1).max(365),
  includeFiles: z.boolean().default(true),
});

type ClinicFormValues = z.infer<typeof clinicFormSchema>;
type NotificationFormValues = z.infer<typeof notificationFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type BackupFormValues = z.infer<typeof backupFormSchema>;

 function SettingsPage() {
  const [activeTab, setActiveTab] = useState("clinic");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clinic form
  const clinicForm = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "ClinicCare Medical Center",
      address: "123 Main St, Anytown, CA 12345",
      phone: "+1 (555) 123-4567",
      email: "info@cliniccare.com",
      website: "https://cliniccare.com",
      description:
        "A comprehensive medical clinic providing quality healthcare services.",
      logo: "",
    },
  });

  // Notification form
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      marketingEmails: false,
      newPatientNotifications: true,
      paymentNotifications: true,
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipRestriction: false,
      allowedIps: "",
    },
  });

  // Backup form
  const backupForm = useForm<BackupFormValues>({
    resolver: zodResolver(backupFormSchema),
    defaultValues: {
      autoBackup: true,
      backupFrequency: "daily",
      backupTime: "02:00",
      retentionPeriod: 30,
      includeFiles: true,
    },
  });

  // Handle clinic form submission
  async function onClinicSubmit(data: ClinicFormValues) {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log(data);

      toast( "Clinic settings updated",{
        
        description: "Your clinic settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating clinic settings:", error);
      toast.error( "Error",{
        // title:
        description: "Failed to update clinic settings. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle notification form submission
  async function onNotificationSubmit(data: NotificationFormValues) {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log(data);

      toast("Notification settings updated", {
        description:
          "Your notification settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Error", {
        // title: "Error",
        description:
          "Failed to update notification settings. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle security form submission
  async function onSecuritySubmit(data: SecurityFormValues) {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log(data);

      toast("Security settings updated", {
        description: "Your security settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
      toast.error("Error", {
        // title: "Error",
        description: "Failed to update security settings. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle backup form submission
  async function onBackupSubmit(data: BackupFormValues) {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your API
      console.log(data);

      toast("Backup settings updated", {
        description: "Your backup settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating backup settings:", error);
      toast.error("Error", {
        description: "Failed to update backup settings. Please try again.",
        // variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="hidden sm:inline">Clinic</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic">
          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>
                Manage your clinic details and information.
              </CardDescription>
            </CardHeader>
            <Form {...clinicForm}>
              <form onSubmit={clinicForm.handleSubmit(onClinicSubmit)}>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/3 space-y-6">
                      <FormField
                        control={clinicForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clinic Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter clinic name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clinicForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter clinic address"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={clinicForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={clinicForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter email address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={clinicForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter website URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={clinicForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter clinic description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="md:w-1/3">
                      <FormField
                        control={clinicForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Clinic Logo</FormLabel>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 h-48">
                              {field.value ? (
                                <div className="relative w-full h-full">
                                  <img
                                    src={field.value || "/placeholder.svg"}
                                    alt="Clinic Logo"
                                    className="object-contain w-full h-full"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-0 right-0"
                                    onClick={() =>
                                      clinicForm.setValue("logo", "")
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Drag & drop or click to upload
                                  </p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                  >
                                    Upload Logo
                                  </Button>
                                </div>
                              )}
                            </div>
                            <FormDescription>
                              Upload your clinic logo. Recommended size:
                              200x200px.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <Form {...notificationForm}>
              <form
                onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
              >
                <CardContent className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via email.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            SMS Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via SMS.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="appointmentReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Appointment Reminders
                          </FormLabel>
                          <FormDescription>
                            Send reminders for upcoming appointments.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Marketing Emails
                          </FormLabel>
                          <FormDescription>
                            Receive marketing and promotional emails.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="newPatientNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            New Patient Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications when new patients register.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationForm.control}
                    name="paymentNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Payment Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications for payments and invoices.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for your clinic.
              </CardDescription>
            </CardHeader>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="twoFactorAuth"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Two-Factor Authentication
                          </FormLabel>
                          <FormDescription>
                            Require two-factor authentication for all users.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Automatically log out users after this period of
                          inactivity.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="passwordExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Expiry (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Force users to change their password after this many
                          days.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="ipRestriction"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            IP Restriction
                          </FormLabel>
                          <FormDescription>
                            Restrict access to specific IP addresses.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {securityForm.watch("ipRestriction") && (
                    <FormField
                      control={securityForm.control}
                      name="allowedIps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allowed IP Addresses</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter IP addresses, one per line"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter IP addresses or CIDR ranges, one per line.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>
                Configure database backup settings.
              </CardDescription>
            </CardHeader>
            <Form {...backupForm}>
              <form onSubmit={backupForm.handleSubmit(onBackupSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={backupForm.control}
                    name="autoBackup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Automatic Backups
                          </FormLabel>
                          <FormDescription>
                            Enable automatic database backups.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {backupForm.watch("autoBackup") && (
                    <>
                      <FormField
                        control={backupForm.control}
                        name="backupFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Backup Frequency</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              How often to perform backups.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={backupForm.control}
                        name="backupTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Backup Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              When to perform the backup (24-hour format).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={backupForm.control}
                        name="retentionPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Retention Period (days)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              How long to keep backups before deleting them.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={backupForm.control}
                        name="includeFiles"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Include Files
                              </FormLabel>
                              <FormDescription>
                                Include uploaded files in the backup.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <div className="flex flex-col gap-4 pt-4">
                    <Button type="button" variant="outline" className="w-full">
                      Backup Now
                    </Button>
                    <Button type="button" variant="outline" className="w-full">
                      Restore from Backup
                    </Button>
                    <Button type="button" variant="outline" className="w-full">
                      Download Latest Backup
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </PageContainer>
  );
}

export default function Settings() {
  return <DashboardLayout>
    <SettingsPage />
  </DashboardLayout> 
}