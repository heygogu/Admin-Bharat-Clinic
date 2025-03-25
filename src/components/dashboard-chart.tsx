"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DashboardChartProps {
  period: string;
}

export function DashboardChart({ period }: DashboardChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/revenue?period=${period}`);
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          console.error("Failed to fetch chart data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [period]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[300px] text-muted-foreground">
        No revenue data available for this period.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        
      >
        <CartesianGrid 
        strokeDasharray="2 2" 
        stroke="#E5E7EB" 
        vertical={false} 
        />
        <XAxis 
        dataKey="name" 
        axisLine={false}
        tickLine={false}
        dy={10}
        tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <YAxis 
        axisLine={false}
        tickLine={false}
        dx={-10}
        tick={{ fill: '#6B7280', fontSize: 12 }}
        />
        <Tooltip
        formatter={(value) => [`$${value}`, "Revenue"]}
        labelFormatter={(label) => `Period: ${label}`}
        contentStyle={{
          
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          padding: '12px'
        }}
        />
      <Bar 
      dataKey="revenue" 
      fill="#3b82f6"
      radius={[6, 6, 0, 0]}
      maxBarSize={50}
      activeBar={{ fill: "#3b82f6" }}
      
      />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
