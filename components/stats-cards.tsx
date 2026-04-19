"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/lib/app-context";

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: "cyan" | "purple" | "orange" | "green";
  trend?: { value: number; isUp: boolean };
  index?: number;
}

function StatCard({ title, value, subtitle, icon, color, trend, index = 0 }: StatCardProps) {
  const colorConfig = {
    cyan: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      text: "text-primary",
      glow: "glow-cyan",
    },
    purple: {
      bg: "bg-secondary/10",
      border: "border-secondary/30",
      text: "text-secondary",
      glow: "glow-purple",
    },
    orange: {
      bg: "bg-accent/10",
      border: "border-accent/30",
      text: "text-accent",
      glow: "glow-orange",
    },
    green: {
      bg: "bg-success/10",
      border: "border-success/30",
      text: "text-success",
      glow: "glow-green",
    },
  };

  const config = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className={`glass ${config.border} hover:${config.glow} transition-all duration-300`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className={`p-2.5 rounded-xl ${config.bg}`}>
              <div className={config.text}>{icon}</div>
            </div>
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${trend.isUp ? "text-success" : "text-destructive"}`}>
                <TrendingUpIcon className={`w-3 h-3 ${!trend.isUp && "rotate-180"}`} />
                {trend.value}%
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className={`text-sm font-medium ${config.text}`}>{title}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsCards() {
  const { schedules, regions, currentStage } = useApp();

  const todaySchedules = schedules.filter((s) => {
    const today = new Date().toISOString().split("T")[0];
    return s.date === today;
  });

  const activeOutages = schedules.filter((s) => s.status === "active").length;
  const upcomingOutages = schedules.filter((s) => s.status === "upcoming").length;
  const totalHoursToday = todaySchedules.reduce((acc, s) => {
    const [startH] = s.startTime.split(":").map(Number);
    const [endH] = s.endTime.split(":").map(Number);
    return acc + (endH - startH);
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Current Stage"
        value={`Stage ${currentStage}`}
        subtitle="National grid status"
        icon={<ZapIcon className="w-5 h-5" />}
        color="orange"
        index={0}
      />
      <StatCard
        title="Active Outages"
        value={activeOutages}
        subtitle="Currently in progress"
        icon={<ZapIcon className="w-5 h-5" />}
        color="cyan"
        trend={{ value: 12, isUp: false }}
        index={1}
      />
      <StatCard
        title="Upcoming Today"
        value={upcomingOutages}
        subtitle="Scheduled outages"
        icon={<ClockIcon className="w-5 h-5" />}
        color="purple"
        index={2}
      />
      <StatCard
        title="Affected Regions"
        value={regions.length}
        subtitle={`${totalHoursToday}h total downtime`}
        icon={<MapIcon className="w-5 h-5" />}
        color="green"
        trend={{ value: 5, isUp: true }}
        index={3}
      />
    </div>
  );
}
