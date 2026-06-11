"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface Props {
  data: { day: string; leads: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2a1f14] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
      <p className="font-semibold">{label}</p>
      <p className="text-caramelo">{payload[0].value} lead{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function LeadsChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.leads), 1);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="35%">
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#8D7C69", fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#8D7C69", fontFamily: "inherit" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0e8da", radius: 6 }} />
        <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.leads === max && max > 0 ? "#D6A25F" : "#e8d9c4"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
