import { supabase } from "./supabase";
import type { Database } from "./database.types";
import type { OutageSchedule } from "./types";

type ScheduleUpdate = Database["public"]["Tables"]["outage_schedules"]["Update"];

/**
 * Map a Supabase outage_schedules row (snake_case) to the app's OutageSchedule type (camelCase).
 */
function mapScheduleRow(row: {
  id: string;
  region_id: string;
  region_name: string;
  start_time: string;
  end_time: string;
  date: string;
  stage: number;
  status: "upcoming" | "active" | "completed";
}): OutageSchedule {
  return {
    id: row.id,
    regionId: row.region_id,
    regionName: row.region_name,
    startTime: row.start_time,
    endTime: row.end_time,
    date: row.date,
    stage: row.stage,
    status: row.status,
  };
}

/**
 * Fetch all outage schedules, optionally filtered by region.
 * Results are sorted by date (ascending) then start_time (ascending).
 */
export async function fetchSchedules(regionId?: string): Promise<OutageSchedule[]> {
  let query = supabase
    .from("outage_schedules")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (regionId) {
    query = query.eq("region_id", regionId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch schedules:", error.message);
    return [];
  }

  return (data ?? []).map(mapScheduleRow);
}

/**
 * Add a new outage schedule.
 * Returns the created schedule or null on failure.
 */
export async function addScheduleToDb(
  schedule: Omit<OutageSchedule, "id">
): Promise<OutageSchedule | null> {
  const { data, error } = await supabase
    .from("outage_schedules")
    .insert({
      region_id: schedule.regionId,
      region_name: schedule.regionName,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      date: schedule.date,
      stage: schedule.stage,
      status: schedule.status,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add schedule:", error.message);
    return null;
  }

  return data ? mapScheduleRow(data) : null;
}

/**
 * Update an existing outage schedule by ID.
 * Only the provided fields will be updated.
 */
export async function updateScheduleInDb(
  id: string,
  updates: Partial<OutageSchedule>
): Promise<boolean> {
  const dbUpdates: ScheduleUpdate = {};

  if (updates.regionId !== undefined) dbUpdates.region_id = updates.regionId;
  if (updates.regionName !== undefined) dbUpdates.region_name = updates.regionName;
  if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime;
  if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime;
  if (updates.date !== undefined) dbUpdates.date = updates.date;
  if (updates.stage !== undefined) dbUpdates.stage = updates.stage;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const { error } = await supabase
    .from("outage_schedules")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    console.error("Failed to update schedule:", error.message);
    return false;
  }

  return true;
}

/**
 * Delete an outage schedule by ID.
 */
export async function deleteScheduleFromDb(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("outage_schedules")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete schedule:", error.message);
    return false;
  }

  return true;
}
