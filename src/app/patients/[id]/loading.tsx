import DashboardLayout from "@/components/dashboard-layout";
import { Loader } from "lucide-react";

function Loading() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader className="w-7 h-7 animate-spin" />
      </div>
    </DashboardLayout>
  );
}

export default Loading;
