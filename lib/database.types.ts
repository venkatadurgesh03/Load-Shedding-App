/**
 * Supabase Database type definitions.
 *
 * These types mirror the SQL schema and provide full type safety
 * for all Supabase queries. They map Supabase snake_case columns
 * to the app's existing camelCase interfaces via the query helpers.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      regions: {
        Row: {
          id: string;
          name: string;
          zone: string;
          stage: number;
        };
        Insert: {
          id: string;
          name: string;
          zone: string;
          stage?: number;
        };
        Update: {
          id?: string;
          name?: string;
          zone?: string;
          stage?: number;
        };
        Relationships: [];
      };
      outage_schedules: {
        Row: {
          id: string;
          region_id: string;
          region_name: string;
          start_time: string;
          end_time: string;
          date: string;
          stage: number;
          status: "upcoming" | "active" | "completed";
          created_at: string;
        };
        Insert: {
          id?: string;
          region_id: string;
          region_name: string;
          start_time: string;
          end_time: string;
          date: string;
          stage: number;
          status: "upcoming" | "active" | "completed";
          created_at?: string;
        };
        Update: {
          id?: string;
          region_id?: string;
          region_name?: string;
          start_time?: string;
          end_time?: string;
          date?: string;
          stage?: number;
          status?: "upcoming" | "active" | "completed";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "outage_schedules_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "regions";
            referencedColumns: ["id"];
          },
        ];
      };
      app_settings: {
        Row: {
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: "info" | "warning" | "success" | "error";
          timestamp: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type: "info" | "warning" | "success" | "error";
          timestamp?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: "info" | "warning" | "success" | "error";
          timestamp?: string;
          read?: boolean;
        };
        Relationships: [];
      };
      daily_stats: {
        Row: {
          date: string;
          total_outages: number;
          total_hours: number;
          affected_regions: number;
        };
        Insert: {
          date: string;
          total_outages: number;
          total_hours: number;
          affected_regions: number;
        };
        Update: {
          date?: string;
          total_outages?: number;
          total_hours?: number;
          affected_regions?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
