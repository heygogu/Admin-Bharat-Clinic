"use client"
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DashboardChart } from "./dashboard-chart";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
const RevenueChart = () => {
    const [period, setPeriod] = useState("month");
    return (
      <div>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <Select
              defaultValue="month"
              onValueChange={(value) => setPeriod(value)}
            >
              <SelectTrigger>
                <span className="flex capitalize items-center space-x-1">
                  {period}
                 
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week" onClick={() => setPeriod("week")}>
                  Week
                </SelectItem>
                <SelectItem value="month" onClick={() => setPeriod("month")}>
                  Month
                </SelectItem>
                <SelectItem
                  value="quarter"
                  onClick={() => setPeriod("quarter")}
                >
                  Quarter
                </SelectItem>
                <SelectItem value="year" onClick={() => setPeriod("year")}>
                  Year
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <DashboardChart period={period} />
          </CardContent>
        </Card>
      </div>
    );
};

export default RevenueChart;
