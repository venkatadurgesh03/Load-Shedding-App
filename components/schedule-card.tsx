"use client";

import { motion } from "framer-motion";
import type { OutageSchedule } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format, parseISO, differenceInMinutes, isToday, isTomorrow } from "date-fns";
import { useEffect, useState } from "react";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ZapOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12.41 6.75 13 2 10.57 4.92" />
      <polyline points="18.57 12.91 21 10 15.66 10" />
      <polyline points="8 8 3 14 12 14 11 22 16 16" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

interface ScheduleCardProps {
  schedule: OutageSchedule;
  index?: number;
}

function CountdownTimer({ targetDate, targetTime }: { targetDate: string; targetTime: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const diff = differenceInMinutes(target, now);

      if (diff <= 0) return "Starting now";

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
      }

      return `${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return <span>{timeLeft}</span>;
}

export function ScheduleCard({ schedule, index = 0 }: ScheduleCardProps) {
  const getStatusConfig = () => {
    switch (schedule.status) {
      case "active":
        return {
          border: "border-destructive/50",
          glow: "glow-red",
          badge: "bg-destructive/20 text-destructive border-destructive/30",
          badgeText: "ACTIVE",
          icon: <ZapOffIcon className="w-4 h-4" />,
        };
      case "upcoming":
        return {
          border: "border-accent/50",
          glow: "",
          badge: "bg-accent/20 text-accent border-accent/30",
          badgeText: "UPCOMING",
          icon: <ClockIcon className="w-4 h-4" />,
        };
      default:
        return {
          border: "border-muted/50",
          glow: "",
          badge: "bg-muted/50 text-muted-foreground border-muted",
          badgeText: "COMPLETED",
          icon: <ClockIcon className="w-4 h-4" />,
        };
    }
  };

  const config = getStatusConfig();
  const date = parseISO(schedule.date);
  const dateLabel = isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : format(date, "EEE, MMM d");

  const duration = (() => {
    const [startH] = schedule.startTime.split(":").map(Number);
    const [endH] = schedule.endTime.split(":").map(Number);
    return endH - startH;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <Card className={`glass ${config.border} ${config.glow} transition-all duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${config.badge}`}>
                {config.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.badge}`}>
                {config.badgeText}
              </span>
            </div>
            <div className={`text-xs font-mono px-2 py-1 rounded-md ${
              schedule.stage >= 5 ? "bg-destructive/20 text-destructive" :
              schedule.stage >= 3 ? "bg-accent/20 text-accent" :
              "bg-success/20 text-success"
            }`}>
              Stage {schedule.stage}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPinIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{schedule.regionName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{dateLabel}</p>
              <p className="text-lg font-bold font-mono">
                {schedule.startTime} - {schedule.endTime}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
              <p className="text-lg font-bold text-primary">{duration}h</p>
            </div>
          </div>

          {schedule.status === "upcoming" && (
            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Starts in:</span>
                <span className="font-mono text-accent">
                  <CountdownTimer targetDate={schedule.date} targetTime={schedule.startTime} />
                </span>
              </div>
            </div>
          )}

          {schedule.status === "active" && (
            <motion.div
              className="pt-2 border-t border-border/50"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 text-destructive">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-sm font-medium">Power outage in progress</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
