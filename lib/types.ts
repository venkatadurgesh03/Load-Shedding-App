export interface Region {
  id: string;
  name: string;
  zone: string;
  stage: number;
}

export interface OutageSchedule {
  id: string;
  regionId: string;
  regionName: string;
  startTime: string;
  endTime: string;
  date: string;
  stage: number;
  status: "upcoming" | "active" | "completed";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  region: string;
}

export interface DailyStats {
  date: string;
  totalOutages: number;
  totalHours: number;
  affectedRegions: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}
