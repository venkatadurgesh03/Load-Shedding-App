import { supabase } from "./supabase";
import type { Region } from "./types";

/**
 * Fetch all regions, ordered by zone then name.
 */
export async function fetchRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .order("zone", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch regions:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Update a region's stage level.
 */
export async function updateRegionStage(
  id: string,
  stage: number
): Promise<boolean> {
  const { error } = await supabase
    .from("regions")
    .update({ stage })
    .eq("id", id);

  if (error) {
    console.error("Failed to update region stage:", error.message);
    return false;
  }

  return true;
}
