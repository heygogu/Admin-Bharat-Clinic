import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import autoTable from "jspdf-autotable";

export default function generateAdvancedPDF(formData:any) {
  const doc = new jsPDF("portrait", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header with Logo
  const headerHeight = 40;
  doc.setFillColor(0, 120, 200); // Use a solid color instead of gradient
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Clinic Name & Logo Placeholder
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BHARAT DENTAL CLINIC", 15, 15);
  doc.setFontSize(10);
  doc.text("Excellence in Dental Care", 15, 25);

  // Doctor Details
  doc.setFontSize(9);
  doc.text("DR. AMIT SHARMA", pageWidth - 15, 12, { align: "right" });
  doc.text("Dental Surgeon, BDS", pageWidth - 15, 17, { align: "right" });
  doc.text("☎ +91 98765-43210", pageWidth - 15, 22, { align: "right" });
  doc.text("📍 123 Main Street, Haryana, India", pageWidth - 15, 27, {
    align: "right",
  });

  // Separator
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(15, 35, pageWidth - 15, 35);

  // Patient Details
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Patient Name:", 15, 50);
  doc.text(formData.name || "", 50, 50);
  doc.text("Age:", pageWidth / 2, 50);
  doc.text(formData.age || "", pageWidth / 2 + 10, 50);
  doc.text("Gender:", pageWidth - 60, 50);
  doc.text(formData.gender || "", pageWidth - 30, 50);

  doc.text("Address:", 15, 60);
  doc.text(formData.address || "", 50, 60);
  doc.text("Date:", pageWidth - 60, 60);
  doc.text(
    formData.date ? format(formData.date, "dd/MM/yyyy") : "",
    pageWidth - 30,
    60
  );

  // RX Symbol
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 0, 0);
  doc.text("Rx", 15, 80);
  doc.setTextColor(0, 0, 0);

  // Prescription Table
  autoTable(doc,{
    startY: 90,
    head: [["Medicine", "Dosage", "Frequency", "Notes"]],
    body: formData.prescriptions || [["", "", "", ""]],
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 120, 200], textColor: 255 },
  });

  // Footer
  doc.setFillColor(0, 120, 200);
  doc.rect(0, pageHeight - 15, pageWidth, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("www.bharatdentalclinic.com", 15, pageHeight - 5);
  doc.text("contact@bharatdentalclinic.com", pageWidth - 15, pageHeight - 5, {
    align: "right",
  });

  // Save PDF
  doc.save(
    `prescription-${formData.name.replace(/\s+/g, "-").toLowerCase()}.pdf`
  );
};
