"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyStats } from "@/lib/data";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

type ChartType = "area" | "bar";

export function AnalyticsChart() {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong rounded-lg p-3 border border-border">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span className="text-primary">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ActivityIcon className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-lg">Weekly Analytics</CardTitle>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("area")}
              className={`text-xs ${chartType === "area" ? "bg-primary text-primary-foreground" : ""}`}
            >
              Area
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("bar")}
              className={`text-xs ${chartType === "bar" ? "bg-primary text-primary-foreground" : ""}`}
            >
              Bar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOutages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.75 0.18 195)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="oklch(0.75 0.18 195)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.20 285)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="oklch(0.65 0.20 285)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.03 270 / 0.5)" />
                    <XAxis dataKey="date" stroke="oklch(0.65 0.02 260)" fontSize={12} />
                    <YAxis stroke="oklch(0.65 0.02 260)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="totalOutages"
                      name="Total Outages"
                      stroke="oklch(0.75 0.18 195)"
                      fillOpacity={1}
                      fill="url(#colorOutages)"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalHours"
                      name="Total Hours"
                      stroke="oklch(0.65 0.20 285)"
                      fillOpacity={1}
                      fill="url(#colorHours)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={dailyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.26 0.03 270 / 0.5)" />
                    <XAxis dataKey="date" stroke="oklch(0.65 0.02 260)" fontSize={12} />
                    <YAxis stroke="oklch(0.65 0.02 260)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="totalOutages" name="Total Outages" fill="oklch(0.75 0.18 195)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="affectedRegions" name="Affected Regions" fill="oklch(0.72 0.19 50)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Total Outages</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs text-muted-foreground">
                {chartType === "area" ? "Total Hours" : "Affected Regions"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
