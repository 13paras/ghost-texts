"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import axios, { AxiosError } from "axios";
import { ApiResponseType } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface MessageStat {
  _id: {
    month: string;
    year: number;
  };
  count: number;
}

const MessagesChart = () => {
  const getMsgStats = async () => {
    try {
      const response = await axios.get("/api/message-stats");
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponseType>;
      console.log(axiosError?.response?.data.message);
      toast.error(axiosError.response?.data.message ?? "Failed to get stats");
      return null;
    }
  };

  const [messageStats, setMessageStats] = useState<MessageStat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getMsgStats();
      if (stats) {
        setMessageStats(stats);
      }
    };
    fetchStats();
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const chartData = months.map((month) => {
    const stat = messageStats.find((stat) => stat._id.month === month);
    return {
      month: `${month} ${stat?._id.year ?? new Date().getFullYear()}`,
      messages: stat?.count ?? 0,
    };
  });

  const messageChartConfig = {
    messages: {
      label: "Messages",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <>
       <div className="h-[300px] w-full md:h-[400px] lg:h-[500px]">
      <ChartContainer config={messageChartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split(" ")[0].slice(0, 3)}
              interval={0} // Show all months' ticks
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="messages" fill="var(--color-messages)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
    </>
  );
};

export default MessagesChart;
