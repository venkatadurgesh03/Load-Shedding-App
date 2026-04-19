"use client";

import { motion } from "framer-motion";
import { Header } from "./header";
import { RegionSelector } from "./region-selector";
import { StatsCards } from "./stats-cards";
import { ScheduleList } from "./schedule-list";
import { AnalyticsChart } from "./analytics-chart";
import { useApp } from "@/lib/app-context";
import { stageDescriptions } from "@/lib/data";

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function UserDashboard() {
  const { currentStage } = useApp();

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Stage Alert Banner */}
          {currentStage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl glass border-destructive/50 glow-red"
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="p-2 rounded-lg bg-destructive/20"
                >
                  <AlertTriangleIcon className="w-5 h-5 text-destructive" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-destructive">
                    Stage {currentStage} Load Shedding Active
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stageDescriptions[currentStage]}. Please prepare for extended outages.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Region Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-balance">Load Shedding Dashboard</h2>
              <p className="text-muted-foreground">Monitor and plan for power outages</p>
            </div>
            <RegionSelector />
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Schedule List - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ScheduleList />
            </div>

            {/* Analytics Chart - Takes 1 column */}
            <div className="lg:col-span-1">
              <AnalyticsChart />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>PowerSync Load Shedding Manager</p>
              <p>Real-time outage tracking and notifications</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
