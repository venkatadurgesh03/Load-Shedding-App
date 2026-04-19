"use client";

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react";
import type { Region, OutageSchedule, Notification, User } from "./types";
import { fetchRegions } from "./supabase-regions";
import { fetchSchedules } from "./supabase-schedules";
import { fetchNotifications } from "./supabase-notifications";
import { fetchCurrentStage } from "./supabase-settings";
import { supabase } from "./supabase";

interface AppState {
  user: User | null;
  isAdmin: boolean;
  selectedRegion: string | null;
  regions: Region[];
  schedules: OutageSchedule[];
  notifications: Notification[];
  currentStage: number;
  isLoading: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setSelectedRegion: (regionId: string | null) => void;
  addSchedule: (schedule: Omit<OutageSchedule, "id">) => void;
  updateSchedule: (id: string, updates: Partial<OutageSchedule>) => void;
  deleteSchedule: (id: string) => void;
  markNotificationRead: (id: string) => void;
  updateCurrentStage: (stage: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    isAdmin: false,
    selectedRegion: null,
    regions: [],
    schedules: [],
    notifications: [],
    currentStage: 4,
    isLoading: true,
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [regionsData, schedulesData, notificationsData, stageData] = await Promise.all([
          fetchRegions(),
          fetchSchedules(),
          fetchNotifications(),
          fetchCurrentStage(),
        ]);

        setState((prev) => ({
          ...prev,
          regions: regionsData,
          schedules: schedulesData,
          notifications: notificationsData,
          currentStage: stageData,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to load initial data", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }

    loadInitialData();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        console.error("Login failed:", error?.message);
        return { success: false };
      }

      const APPROVED_ADMINS = [
        "venkatadurgesh03@gmail.com",
        "admin@powersync.in"
      ];

      if (!data.user.email || !APPROVED_ADMINS.includes(data.user.email.toLowerCase())) {
        await supabase.auth.signOut();
        return { success: false, error: "Access denied. Admin account required." };
      }

      setState((prev) => ({
        ...prev,
        user: {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split("@")[0],
          email: data.user.email || email,
          role: "admin",
          region: "all",
        },
        isAdmin: true,
      }));

      return { success: true };
    } catch (err) {
      console.error("Unexpected login error:", err);
      return { success: false };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState((prev) => ({
      ...prev,
      user: null,
      isAdmin: false,
    }));
  }, []);

  const setSelectedRegion = useCallback(async (regionId: string | null) => {
    setState((prev) => ({ ...prev, selectedRegion: regionId, isLoading: true }));
    const newSchedules = await fetchSchedules(regionId ?? undefined);
    setState((prev) => ({ ...prev, schedules: newSchedules, isLoading: false }));
  }, []);

  const addSchedule = useCallback((schedule: Omit<OutageSchedule, "id">) => {
    const newSchedule: OutageSchedule = {
      ...schedule,
      id: `schedule-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      schedules: [...prev.schedules, newSchedule].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      }),
    }));
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<OutageSchedule>) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((s) => s.id !== id),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const updateCurrentStage = useCallback((stage: number) => {
    setState((prev) => ({ ...prev, currentStage: stage }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setSelectedRegion,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        markNotificationRead,
        updateCurrentStage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
