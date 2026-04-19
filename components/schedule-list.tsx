"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/app-context";
import { ScheduleCard } from "./schedule-card";
import { Button } from "@/components/ui/button";
import { format, parseISO, isToday, isTomorrow, addDays } from "date-fns";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

type ViewMode = "grid" | "list";
type FilterMode = "all" | "today" | "tomorrow" | "week";

export function ScheduleList() {
  const { schedules } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const filteredSchedules = schedules.filter((schedule) => {
    const date = parseISO(schedule.date);
    const today = new Date();

    switch (filterMode) {
      case "today":
        return isToday(date);
      case "tomorrow":
        return isTomorrow(date);
      case "week":
        return date >= today && date <= addDays(today, 7);
      default:
        return true;
    }
  });

  const groupedSchedules = filteredSchedules.reduce((acc, schedule) => {
    const date = schedule.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, typeof schedules>);

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEEE, MMMM d");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Outage Schedule</h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            {(["all", "today", "tomorrow", "week"] as FilterMode[]).map((mode) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                onClick={() => setFilterMode(mode)}
                className={`text-xs capitalize ${filterMode === mode ? "bg-primary text-primary-foreground" : ""}`}
              >
                {mode}
              </Button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
            >
              <GridIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Schedule Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filterMode}-${viewMode}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {Object.entries(groupedSchedules).length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No scheduled outages found</p>
            </div>
          ) : (
            Object.entries(groupedSchedules).map(([date, dateSchedules]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    {getDateLabel(date)}
                  </h3>
                  <div className="flex-1 h-px bg-border/50" />
                  <span className="text-xs text-muted-foreground">
                    {dateSchedules.length} outage{dateSchedules.length !== 1 && "s"}
                  </span>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                      : "space-y-3"
                  }
                >
                  {dateSchedules.map((schedule, index) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} index={index} />
                  ))}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
