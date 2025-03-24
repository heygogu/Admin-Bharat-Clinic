import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getPayments } from "@/lib/actions/payment-actions";
import { DataTable } from "@/components/data-table/data-table";
import { paymentColumns } from "@/components/data-table/columns";
import { Pagination } from "@/components/pagination";
import { notFound } from "next/navigation";
import PageContainer from "@/components/page-container";
import DashboardLayout from "@/components/dashboard-layout";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 10;

async function PaymentsPage({
  params,
  searchParams,
}: {
  params: { page: string };
  searchParams: { q?: string };
}) {
  const page = parseInt(params.page) || 1;

  if (isNaN(page) || page < 1) {
    notFound();
  }

  const result = await getPayments();

  const allPayments = result.success ? result.data : [];

  // Calculate pagination
  const totalPayments = allPayments.length;
  const totalPages = Math.ceil(totalPayments / ITEMS_PER_PAGE);

  if (page > totalPages && totalPages > 0) {
    notFound();
  }

  // Get current page payments
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const payments = allPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <PageContainer>

    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <Link href="/payments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            Manage and view all payment records in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No payments found.</p>
            </div>
          ) : (
            <>
              <DataTable columns={paymentColumns} data={payments} />
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath="/payments/page"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </PageContainer>
  );
}

export default function Payments(
    props: { params: { page: string } },
    searchParams: { q?: string }
){
    return <DashboardLayout>
        <PaymentsPage
            params={props.params}
            searchParams={searchParams}
        />
    </DashboardLayout>
}
