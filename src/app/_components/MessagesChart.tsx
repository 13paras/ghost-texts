"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const chartData = months.map((month) => {
    const stat = messageStats.find(stat => stat._id.month === month);
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
      <ChartContainer
        config={messageChartConfig}
        className="max-h-96 min-h-[200px] w-full"
      >
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
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
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="messages" fill="var(--color-messages)" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  );
};

export default MessagesChart;
