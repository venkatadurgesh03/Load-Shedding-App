import { supabase } from "./supabase";

/**
 * Fetch a setting value by key.
 * Returns the value string or the provided default if not found.
 */
export async function fetchSetting(
  key: string,
  defaultValue: string
): Promise<string> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      // PGRST116 = "not found" — expected when key doesn't exist yet
      console.error("Failed to fetch setting:", error.message);
    }
    return defaultValue;
  }

  return data.value;
}

/**
 * Upsert a setting value by key.
 * Creates the row if it doesn't exist, updates if it does.
 */
export async function upsertSetting(
  key: string,
  value: string
): Promise<boolean> {
  const { error } = await supabase
    .from("app_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    console.error("Failed to upsert setting:", error.message);
    return false;
  }

  return true;
}

/**
 * Get the current national load shedding stage.
 * Defaults to stage 4 if no setting exists.
 */
export async function fetchCurrentStage(): Promise<number> {
  const value = await fetchSetting("current_stage", "4");
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 4 : parsed;
}

/**
 * Update the current national load shedding stage.
 */
export async function updateCurrentStageInDb(
  stage: number
): Promise<boolean> {
  return upsertSetting("current_stage", String(stage));
}
