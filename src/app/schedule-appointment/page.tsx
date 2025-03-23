"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Download,
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import {toast} from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ToothLogo from "@/assets/images/tooth_logo.jpg";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import autoTable from "jspdf-autotable";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";
import generateAdvancedPDF from "@/components/PDFGenerator";
import { useUser } from "@clerk/nextjs";

// Define types
interface AppointmentFormData {
  name: string;
  age: string;
  gender: string;
  address: string;
  phoneNumber: string;
  date: Date | null;
  time: string;
  diagnosis: string;
  notes: string;
}

// Custom DatePicker component
const DatePicker: React.FC<{
  date: Date | null;
  onDateChange: (date: Date) => void;
}> = ({ date, onDateChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
        onChange={(e) => {
          if (e.target.value) {
            onDateChange(new Date(e.target.value));
          }
        }}
        className="w-full"
      />
      <Button
        variant="outline"
        size="icon"
        type="button"
        onClick={() => onDateChange(new Date())}
      >
        <Calendar className="h-4 w-4" />
      </Button>
    </div>
  );
};

function ScheduleAppointment() {

    const {user} =useUser();
    console.log("loggedinuser",user?.publicMetadata?.role);

  const [activeTab, setActiveTab] = useState<string>("details");
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: "",
    age: "",
    gender: "",
    address: "",
    phoneNumber: "",
    date: null,
    time: "",
    diagnosis: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

//  const generatePDF = () => {
//    const doc = new jsPDF();
//    const pageWidth = doc.internal.pageSize.getWidth();
//    const pageHeight = doc.internal.pageSize.getHeight();

//    // Add background design with tooth watermark
//    // This would simulate the tooth watermark seen in Image 2
//    doc.setDrawColor(240, 240, 240);
//    doc.setFillColor(240, 240, 240);

//    // Header with gradient-like effect (teal/blue like in both images)
//    doc.setFillColor(0, 156, 222); // Light blue color for top
//    doc.rect(0, 0, pageWidth, 40, "F");
//    doc.setFillColor(0, 120, 174); // Darker blue for bottom part
//    doc.rect(0, 25, pageWidth, 15, "F");

//    // Add clinic logo - in a real implementation, you would use doc.addImage()
//    // Instead of a placeholder, we'll add text as the logo
//    doc.setTextColor(255, 255, 255);
//    doc.setFontSize(22);
//    doc.setFont("Helvetica", "bold");
//    doc.text("BHARAT DENTAL CLINIC", 15, 20);

//    // Add tooth icon as part of the logo (simulated with text)
//    doc.setFontSize(10);
//    doc.setFont("Helvetica", "normal");
//    doc.text("Specialized Dental Care", 15, 28);

  

//    // Add contact details on the right side
//    doc.setFontSize(9);
//    doc.text("DR. AMIT SHARMA", pageWidth - 15, 15, { align: "right" });
//    doc.text("DENTAL SURGEON, BDS", pageWidth - 15, 20, { align: "right" });
//    doc.text("Oral Health Expert", pageWidth - 15, 25, { align: "right" });

//    // Contact information on top right
//    doc.text("☎ +91 98765-43210, +91-12345-67890", 15, 38);
//    doc.text("📍 123 Main Street, Haryana, India", pageWidth - 15, 38, {
//      align: "right",
//    });

//    // Add blue line separator like in Image 2
//    doc.setDrawColor(0, 156, 222);
//    doc.setLineWidth(1);
//    doc.line(15, 50, pageWidth - 15, 50);

//    // Patient details section
//    doc.setTextColor(0, 0, 0);
//    doc.setFontSize(11);
//    doc.text("Name:", 15, 60);
//    doc.line(40, 60, pageWidth / 2 - 10, 60);
//    doc.text(formData.name || "", 45, 60);

//    doc.text("Age:", pageWidth / 2, 60);
//    doc.line(pageWidth / 2 + 20, 60, pageWidth / 2 + 40, 60);
//    doc.text(formData.age || "", pageWidth / 2 + 25, 60);

//    doc.text("Gender:", pageWidth - 60, 60);
//    doc.line(pageWidth - 35, 60, pageWidth - 15, 60);
//    doc.text(formData.gender || "", pageWidth - 30, 60);

//    doc.text("Date:", pageWidth - 60, 70);
//    doc.line(pageWidth - 35, 70, pageWidth - 15, 70);
//    doc.text(
//      formData.date ? format(formData.date, "dd/MM/yyyy") : "",
//      pageWidth - 30,
//      70
//    );

//    doc.text("Addr:", 15, 70);
//    doc.line(40, 70, pageWidth / 2 - 10, 70);
//    doc.text(formData.address || "", 45, 70);

//    // Add Rx symbol for prescription
//    doc.setFontSize(22);
//       doc.setFont("Helvetica", "bold");
//    doc.text("Rx:", 15, 90);

//    // Add prescription area (large space for writing)
//    doc.setDrawColor(200, 200, 200);
//    doc.setLineWidth(0.5);

//    // Draw horizontal lines for prescriptions (like ruled paper)
//    let lineY = 100;
//    while (lineY < 230) {
//      doc.line(15, lineY, pageWidth - 15, lineY);
//      lineY += 10;
//    }

//    // Add date and signature at bottom
//    doc.setDrawColor(0, 156, 222);
//    doc.setLineWidth(1);
//    doc.line(15, 240, pageWidth - 15, 240);

//    doc.setFontSize(10);
//    doc.text("DATE", 50, 250, { align: "center" });
//    doc.text("SIGNATURE", pageWidth - 50, 250, { align: "center" });

//    doc.line(30, 245, 70, 245); // Date line
//    doc.line(pageWidth - 80, 245, pageWidth - 20, 245); // Signature line

//    // Footer with website and contact
//    doc.setFillColor(0, 156, 222);
//    doc.rect(0, pageHeight - 15, pageWidth, 15, "F");

//    doc.setTextColor(255, 255, 255);
//    doc.setFontSize(8);
//    doc.text("www.bharatdentalclinic.com", 15, pageHeight - 6);
//    doc.text("contact@bharatdentalclinic.com", pageWidth / 2, pageHeight - 6, {
//      align: "center",
//    });
//    doc.text("Follow Us: fb tw in", pageWidth - 15, pageHeight - 6, {
//      align: "right",
//    });

//    // Save PDF
//    doc.save(
//      `prescription-${formData.name.replace(/\s+/g, "-").toLowerCase()}-${format(
//        new Date(),
//        "yyyy-MM-dd"
//      )}.pdf`
//    );

//    toast("Prescription Generated", {
//      description: "Dental prescription has been saved as a PDF",
//    });
//  };

  const saveAppointment = async () => {
    // Validate form
    if (!formData.name || !formData.date) {
      toast.warning("Missing Information", {
        description:
          "Please fill in at least the patient name and appointment date",
        
      });
      return;
    }

    // Mock API call - replace with actual API integration
    try {
      // await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      toast("Appointment Scheduled", {
        description: "The appointment has been successfully scheduled",
      });

   generateAdvancedPDF(formData);

      // Reset form or redirect
      // setFormData({ name: '', age: '', gender: '', ... });
    } catch (error) {
      toast.error("Error", {
        description: "There was an error scheduling the appointment",
        
      });
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <PageContainer>

    <div className="grid grid-cols-1">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Bharat Dental Clinic
          </h1>
          <p className="text-muted-foreground mt-2">
            Schedule a new appointment and generate prescription
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <User size={16} />
              <span>Patient Details</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Schedule Appointment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter patient's full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter contact number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Other" id="other" />
                        <Label htmlFor="other">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="Enter patient's address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={() => setActiveTab("schedule")}
                  className="flex items-center gap-2"
                >
                  Next <Calendar className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Appointment Date</Label>
                    <DatePicker
                      date={formData.date}
                      onDateChange={handleDateChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Appointment Time</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) =>
                        handleSelectChange("time", value)
                      }
                    >
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="14:00">02:00 PM</SelectItem>
                        <SelectItem value="15:00">03:00 PM</SelectItem>
                        <SelectItem value="16:00">04:00 PM</SelectItem>
                        <SelectItem value="17:00">05:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Preliminary Diagnosis</Label>
                  <Textarea
                    id="diagnosis"
                    name="diagnosis"
                    placeholder="Enter preliminary diagnosis or reason for visit"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional notes or patient history"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Back
                </Button>
                <div className="space-x-2 flex">
                  <Button
                    variant="outline"
                    onClick={()=>generateAdvancedPDF(formData)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" /> Generate PDF
                  </Button>
                  <Button
                    onClick={saveAppointment}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" /> Save Appointment
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Card */}
        {formData.name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-primary" />
                  Appointment Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground">Patient Name:</p>
                    <p className="font-medium">
                      {formData.name || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Age/Gender:</p>
                    <p className="font-medium">
                      {formData.age ? formData.age : "-"}
                      {" / "}
                      {formData.gender ? formData.gender : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Appointment:</p>
                    <p className="font-medium">
                      {formData.date
                        ? format(formData.date, "PPP")
                        : "No date selected"}{" "}
                      {formData.time ? `at ${formData.time}` : ""}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact:</p>
                    <p className="font-medium">
                      {formData.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
                {formData.diagnosis && (
                  <div>
                    <p className="text-muted-foreground">Diagnosis:</p>
                    <p className="font-medium">{formData.diagnosis}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs flex items-center gap-1"
                  onClick={()=>generateAdvancedPDF(formData)}
                >
                  <Download className="h-3 w-3" /> PDF
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
    </PageContainer>
  );
}

export default function ScheduleAppointmentPage() {
    return <DashboardLayout>
        <ScheduleAppointment />
    </DashboardLayout>
}