"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

const mockData = [
  { day: "Seg", leads: 0 },
  { day: "Ter", leads: 0 },
  { day: "Qua", leads: 0 },
  { day: "Qui", leads: 0 },
  { day: "Sex", leads: 0 },
  { day: "Sáb", leads: 0 },
  { day: "Dom", leads: 0 },
];

export default function LeadsChart() {
  return (
    <ChartContainer config={{ leads: { label: "Leads", color: "#D6A25F" } }} className="h-[200px]">
      <BarChart data={mockData}>
        <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="leads" fill="#D6A25F" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
