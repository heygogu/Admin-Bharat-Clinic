import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface LabResult {
  _id?: string;
  type: string;
  details: string;
  date: string;
  fileUrl?: string;
  notes?: string;
}

interface LabResultListProps {
  labResults: LabResult[];
}

export function LabResultList({ labResults }: LabResultListProps) {
  if (!labResults || labResults.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No lab results found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labResults.map((result, index) => (
            <TableRow key={result._id || index}>
              <TableCell>
                {format(new Date(result.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell>{result.type}</TableCell>
              <TableCell>{result.details}</TableCell>
              <TableCell>
                {result.fileUrl ? (
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={result.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>{result.notes || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
