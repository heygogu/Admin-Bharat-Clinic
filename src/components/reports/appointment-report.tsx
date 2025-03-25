"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AppointmentReport() {
  const [period, setPeriod] = useState("month");
  const [statusData, setStatusData] = useState<any[]>([]);
  const [dayData, setDayData] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      setLoading(true);
      try {
        // Fetch status distribution
        const statusResponse = await fetch(
          `/api/reports/appointments/status?period=${period}`
        );
        const statusResult = await statusResponse.json();

        if (statusResult.success) {
          setStatusData(statusResult.data);
        } else {
          console.error("Failed to fetch status data:", statusResult.error);
        }

        // Fetch day distribution
        const dayResponse = await fetch(
          `/api/reports/appointments/day?period=${period}`
        );
        const dayResult = await dayResponse.json();

        if (dayResult.success) {
          setDayData(dayResult.data);
        } else {
          console.error("Failed to fetch day data:", dayResult.error);
        }

        // Fetch time distribution
        const timeResponse = await fetch(
          `/api/reports/appointments/time?period=${period}`
        );
        const timeResult = await timeResponse.json();

        if (timeResult.success) {
          setTimeData(timeResult.data);
        } else {
          console.error("Failed to fetch time data:", timeResult.error);
        }
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, [period]);

  const STATUS_COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#F44336", "#9E9E9E"];
  const DAY_COLORS = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 3 months</SelectItem>
            <SelectItem value="year">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="day">Day of Week</TabsTrigger>
          <TabsTrigger value="time">Time of Day</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
              <CardDescription>
                Distribution of appointments by status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Day of Week</CardTitle>
              <CardDescription>
                Distribution of appointments by day of the week.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dayData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Appointments" fill="#8884d8">
                      {dayData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DAY_COLORS[index % DAY_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time">
          <Card>
            <CardHeader>
              <CardTitle>Appointments by Time of Day</CardTitle>
              <CardDescription>
                Distribution of appointments by time of day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="Appointments"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
