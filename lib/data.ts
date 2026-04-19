import type { Region, OutageSchedule, DailyStats, Notification } from "./types";
import { addDays, format, addHours, subHours } from "date-fns";

export const regions: Region[] = [
  { id: "r1", name: "Downtown Central", zone: "Zone A", stage: 2 },
  { id: "r2", name: "Northern Heights", zone: "Zone A", stage: 4 },
  { id: "r3", name: "Riverside District", zone: "Zone B", stage: 3 },
  { id: "r4", name: "Industrial Park", zone: "Zone B", stage: 5 },
  { id: "r5", name: "Westside Gardens", zone: "Zone C", stage: 2 },
  { id: "r6", name: "Eastbrook Valley", zone: "Zone C", stage: 4 },
  { id: "r7", name: "Southgate Community", zone: "Zone D", stage: 3 },
  { id: "r8", name: "Hillcrest Area", zone: "Zone D", stage: 6 },
];

const today = new Date();

export const generateSchedules = (regionFilter?: string): OutageSchedule[] => {
  const schedules: OutageSchedule[] = [];
  const filteredRegions = regionFilter
    ? regions.filter((r) => r.id === regionFilter)
    : regions;

  filteredRegions.forEach((region) => {
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = addDays(today, dayOffset);
      const dateStr = format(date, "yyyy-MM-dd");

      // Generate 1-3 outages per day per region
      const outagesPerDay = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < outagesPerDay; i++) {
        const startHour = Math.floor(Math.random() * 20) + 2;
        const duration = Math.floor(Math.random() * 3) + 2;
        const startTime = `${String(startHour).padStart(2, "0")}:00`;
        const endTime = `${String(Math.min(startHour + duration, 23)).padStart(2, "0")}:00`;

        // Determine status based on current time
        const scheduleStart = addHours(date, startHour);
        const scheduleEnd = addHours(date, startHour + duration);
        let status: "upcoming" | "active" | "completed" = "upcoming";

        if (scheduleEnd < today) {
          status = "completed";
        } else if (scheduleStart <= today && scheduleEnd >= today) {
          status = "active";
        }

        schedules.push({
          id: `${region.id}-${dateStr}-${i}`,
          regionId: region.id,
          regionName: region.name,
          startTime,
          endTime,
          date: dateStr,
          stage: Math.min(region.stage + Math.floor(Math.random() * 2), 8),
          status,
        });
      }
    }
  });

  return schedules.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
};

export const dailyStats: DailyStats[] = [
  { date: format(subHours(today, 144), "MMM dd"), totalOutages: 24, totalHours: 72, affectedRegions: 6 },
  { date: format(subHours(today, 120), "MMM dd"), totalOutages: 18, totalHours: 54, affectedRegions: 5 },
  { date: format(subHours(today, 96), "MMM dd"), totalOutages: 32, totalHours: 96, affectedRegions: 8 },
  { date: format(subHours(today, 72), "MMM dd"), totalOutages: 28, totalHours: 84, affectedRegions: 7 },
  { date: format(subHours(today, 48), "MMM dd"), totalOutages: 22, totalHours: 66, affectedRegions: 6 },
  { date: format(subHours(today, 24), "MMM dd"), totalOutages: 26, totalHours: 78, affectedRegions: 7 },
  { date: format(today, "MMM dd"), totalOutages: 20, totalHours: 60, affectedRegions: 5 },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Stage 4 Activated",
    message: "Load shedding has been escalated to Stage 4 across all zones.",
    type: "warning",
    timestamp: new Date().toISOString(),
    read: false,
  },
  {
    id: "n2",
    title: "Schedule Updated",
    message: "New outage schedule published for your region.",
    type: "info",
    timestamp: subHours(new Date(), 2).toISOString(),
    read: false,
  },
  {
    id: "n3",
    title: "Outage Complete",
    message: "Power has been restored in Downtown Central.",
    type: "success",
    timestamp: subHours(new Date(), 5).toISOString(),
    read: true,
  },
];

export const stageDescriptions: Record<number, string> = {
  1: "Minimal impact - 1000MW shortage",
  2: "Light load shedding - 2000MW shortage",
  3: "Moderate impact - 3000MW shortage",
  4: "Significant impact - 4000MW shortage",
  5: "Heavy load shedding - 5000MW shortage",
  6: "Severe impact - 6000MW shortage",
  7: "Critical shortage - 7000MW shortage",
  8: "Emergency level - 8000MW shortage",
};
