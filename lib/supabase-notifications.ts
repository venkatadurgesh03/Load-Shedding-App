import { supabase } from "./supabase";
import type { Notification, DailyStats } from "./types";

/**
 * Map a Supabase notifications row to the app's Notification type.
 */
function mapNotificationRow(row: {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  read: boolean;
}): Notification {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    timestamp: row.timestamp,
    read: row.read,
  };
}

/**
 * Fetch all notifications, ordered by most recent first.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Failed to fetch notifications:", error.message);
    return [];
  }

  return (data ?? []).map(mapNotificationRow);
}

/**
 * Mark a notification as read.
 */
export async function markNotificationReadInDb(
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Failed to mark notification read:", error.message);
    return false;
  }

  return true;
}

/**
 * Add a new notification.
 * Returns the created notification or null on failure.
 */
export async function addNotificationToDb(
  notification: Omit<Notification, "id">
): Promise<Notification | null> {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: notification.timestamp,
      read: notification.read,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add notification:", error.message);
    return null;
  }

  return data ? mapNotificationRow(data) : null;
}

/**
 * Map a Supabase daily_stats row (snake_case) to the app's DailyStats type (camelCase).
 */
function mapDailyStatsRow(row: {
  date: string;
  total_outages: number;
  total_hours: number;
  affected_regions: number;
}): DailyStats {
  return {
    date: row.date,
    totalOutages: row.total_outages,
    totalHours: row.total_hours,
    affectedRegions: row.affected_regions,
  };
}

/**
 * Fetch daily stats, ordered by date ascending.
 */
export async function fetchDailyStats(): Promise<DailyStats[]> {
  const { data, error } = await supabase
    .from("daily_stats")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    console.error("Failed to fetch daily stats:", error.message);
    return [];
  }

  return (data ?? []).map(mapDailyStatsRow);
}
