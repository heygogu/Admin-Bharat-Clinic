import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Payment {
  _id?: string;
  amount: number;
  method: string;
  date: string;
  notes?: string;
}

interface PaymentListProps {
  payments: Payment[];
}

export function PaymentList({ payments }: PaymentListProps) {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No payment records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={payment._id || index}>
              <TableCell>
                {format(new Date(payment.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
              <TableCell>{payment.method}</TableCell>
              <TableCell>{payment.notes || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
