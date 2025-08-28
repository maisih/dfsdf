export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      daily_logs: {
        Row: {
          created_at: string
          deliveries: string | null
          equipment_used: string | null
          id: string
          issues: string | null
          laborers: number | null
          log_date: string
          logged_by: string | null
          operators: number | null
          project_id: string
          supervisors: number | null
          updated_at: string
          weather: string | null
          work_performed: string | null
        }
        Insert: {
          created_at?: string
          deliveries?: string | null
          equipment_used?: string | null
          id?: string
          issues?: string | null
          laborers?: number | null
          log_date?: string
          logged_by?: string | null
          operators?: number | null
          project_id: string
          supervisors?: number | null
          updated_at?: string
          weather?: string | null
          work_performed?: string | null
        }
        Update: {
          created_at?: string
          deliveries?: string | null
          equipment_used?: string | null
          id?: string
          issues?: string | null
          laborers?: number | null
          log_date?: string
          logged_by?: string | null
          operators?: number | null
          project_id?: string
          supervisors?: number | null
          updated_at?: string
          weather?: string | null
          work_performed?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean | null
          mime_type: string | null
          name: string
          project_id: string | null
          uploaded_by: string | null
          version: number | null
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          name: string
          project_id?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          mime_type?: string | null
          name?: string
          project_id?: string | null
          uploaded_by?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          expense_date: string | null
          id: string
          project_id: string
          receipt_url: string | null
          recorded_by: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          expense_date?: string | null
          id?: string
          project_id: string
          receipt_url?: string | null
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          expense_date?: string | null
          id?: string
          project_id?: string
          receipt_url?: string | null
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invitation_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          expires_at: string
          id: string
          max_uses: number | null
          role: Database["public"]["Enums"]["user_role"]
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          expires_at: string
          id?: string
          max_uses?: number | null
          role: Database["public"]["Enums"]["user_role"]
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          expires_at?: string
          id?: string
          max_uses?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      materials: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          name: string
          ordered_at: string | null
          ordered_by: string | null
          project_id: string
          quantity: number
          supplier: string | null
          unit: string
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          name: string
          ordered_at?: string | null
          ordered_by?: string | null
          project_id: string
          quantity: number
          supplier?: string | null
          unit: string
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          name?: string
          ordered_at?: string | null
          ordered_by?: string | null
          project_id?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          ai_analysis: Json | null
          caption: string | null
          created_at: string
          file_path: string
          id: string
          project_id: string | null
          signal_id: string | null
          task_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          caption?: string | null
          created_at?: string
          file_path: string
          id?: string
          project_id?: string | null
          signal_id?: string | null
          task_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          caption?: string | null
          created_at?: string
          file_path?: string
          id?: string
          project_id?: string | null
          signal_id?: string | null
          task_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "signals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id?: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string
          project_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          project_id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          project_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          name: string
          progress: number | null
          spent: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name: string
          progress?: number | null
          spent?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          name?: string
          progress?: number | null
          spent?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      signals: {
        Row: {
          created_at: string
          description: string | null
          id: string
          location: string | null
          priority: Database["public"]["Enums"]["signal_priority"] | null
          project_id: string
          reported_by: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          title: string
          type: Database["public"]["Enums"]["signal_type"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          priority?: Database["public"]["Enums"]["signal_priority"] | null
          project_id: string
          reported_by?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          title: string
          type?: Database["public"]["Enums"]["signal_type"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          priority?: Database["public"]["Enums"]["signal_priority"] | null
          project_id?: string
          reported_by?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          title?: string
          type?: Database["public"]["Enums"]["signal_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "signals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: number | null
          project_id: string
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          project_id: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: number | null
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_role_safe: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      project_status:
        | "planning"
        | "active"
        | "on-hold"
        | "completed"
        | "cancelled"
      signal_priority: "low" | "medium" | "high" | "critical"
      signal_type:
        | "safety"
        | "quality"
        | "material"
        | "equipment"
        | "weather"
        | "other"
      task_status: "pending" | "in-progress" | "completed" | "cancelled"
      user_role: "engineer" | "worker" | "visitor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      project_status: [
        "planning",
        "active",
        "on-hold",
        "completed",
        "cancelled",
      ],
      signal_priority: ["low", "medium", "high", "critical"],
      signal_type: [
        "safety",
        "quality",
        "material",
        "equipment",
        "weather",
        "other",
      ],
      task_status: ["pending", "in-progress", "completed", "cancelled"],
      user_role: ["engineer", "worker", "visitor"],
    },
  },
} as const
