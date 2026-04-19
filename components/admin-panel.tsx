"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/app-context";
import { Header } from "./header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import type { OutageSchedule } from "@/lib/types";
import { stageDescriptions } from "@/lib/data";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function MoreVertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

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

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

type TabType = "schedules" | "regions" | "settings";

export function AdminPanel() {
  const { schedules, regions, currentStage, updateCurrentStage, deleteSchedule, addSchedule } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("schedules");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    regionId: "",
    date: "",
    startTime: "08:00",
    endTime: "10:00",
    stage: 4,
  });

  useEffect(() => {
    setNewSchedule((prev) => ({ ...prev, date: format(new Date(), "yyyy-MM-dd") }));
  }, []);

  const handleAddSchedule = () => {
    const region = regions.find((r) => r.id === newSchedule.regionId);
    if (!region) return;

    addSchedule({
      regionId: newSchedule.regionId,
      regionName: region.name,
      date: newSchedule.date,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      stage: newSchedule.stage,
      status: "upcoming",
    });

    setShowAddForm(false);
    setNewSchedule({
      regionId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "08:00",
      endTime: "10:00",
      stage: 4,
    });
  };

  const tabs = [
    { id: "schedules" as const, label: "Schedules", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "regions" as const, label: "Regions", icon: <UsersIcon className="w-4 h-4" /> },
    { id: "settings" as const, label: "Settings", icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />

        <main className="container mx-auto px-4 py-6">
          {/* Admin Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="p-2 rounded-lg bg-secondary/20">
                  <ZapIcon className="w-5 h-5 text-secondary" />
                </span>
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Manage load shedding schedules and regions</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 p-1 rounded-lg bg-muted/30 w-fit">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 ${activeTab === tab.id ? "bg-primary text-primary-foreground" : ""}`}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "schedules" && (
              <motion.div
                key="schedules"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Scheduled Outages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Region</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stage</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedules.slice(0, 10).map((schedule) => (
                            <motion.tr
                              key={schedule.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm">{schedule.regionName}</td>
                              <td className="py-3 px-4 text-sm font-mono">
                                {format(parseISO(schedule.date), "MMM dd, yyyy")}
                              </td>
                              <td className="py-3 px-4 text-sm font-mono">
                                {schedule.startTime} - {schedule.endTime}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  schedule.stage >= 5 ? "bg-destructive/20 text-destructive" :
                                  schedule.stage >= 3 ? "bg-accent/20 text-accent" :
                                  "bg-success/20 text-success"
                                }`}>
                                  Stage {schedule.stage}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                                  schedule.status === "active" ? "bg-destructive/20 text-destructive" :
                                  schedule.status === "upcoming" ? "bg-accent/20 text-accent" :
                                  "bg-muted/50 text-muted-foreground"
                                }`}>
                                  {schedule.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertIcon className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="glass-strong">
                                    <DropdownMenuItem>
                                      <EditIcon className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => deleteSchedule(schedule.id)}
                                    >
                                      <TrashIcon className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "regions" && (
              <motion.div
                key="regions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regions.map((region, index) => (
                    <motion.div
                      key={region.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass border-border/50 hover:border-primary/50 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{region.name}</h3>
                              <p className="text-sm text-muted-foreground">{region.zone}</p>
                            </div>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                              region.stage >= 5 ? "bg-destructive/20 text-destructive" :
                              region.stage >= 3 ? "bg-accent/20 text-accent" :
                              "bg-success/20 text-success"
                            }`}>
                              Stage {region.stage}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">National Stage Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Set the current national load shedding stage. This affects all regions.
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Current Stage:</span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((stage) => (
                          <Button
                            key={stage}
                            variant="outline"
                            size="sm"
                            onClick={() => updateCurrentStage(stage)}
                            className={currentStage === stage ? "bg-primary text-primary-foreground border-primary" : ""}
                          >
                            {stage}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stageDescriptions[currentStage]}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Schedule Modal */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowAddForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="glass-strong border-primary/30 w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Add New Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Region</label>
                        <select
                          value={newSchedule.regionId}
                          onChange={(e) => setNewSchedule({ ...newSchedule, regionId: e.target.value })}
                          className="w-full p-2 rounded-lg bg-input border border-border text-foreground"
                        >
                          <option value="">Select a region</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={newSchedule.date}
                          onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Start Time</label>
                          <Input
                            type="time"
                            value={newSchedule.startTime}
                            onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                            className="bg-input border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">End Time</label>
                          <Input
                            type="time"
                            value={newSchedule.endTime}
                            onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                            className="bg-input border-border"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Stage</label>
                        <select
                          value={newSchedule.stage}
                          onChange={(e) => setNewSchedule({ ...newSchedule, stage: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-input border border-border text-foreground"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((stage) => (
                            <option key={stage} value={stage}>
                              Stage {stage}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddSchedule}
                          disabled={!newSchedule.regionId}
                          className="flex-1 bg-gradient-to-r from-primary to-secondary"
                        >
                          Add Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
