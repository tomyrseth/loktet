export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bodyweight: {
        Row: {
          bodyweight: number | null
          created_at: string
          id: number
          uid: number
        }
        Insert: {
          bodyweight?: number | null
          created_at: string
          id?: number
          uid: number
        }
        Update: {
          bodyweight?: number | null
          created_at?: string
          id?: number
          uid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_bodyweight_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      calories: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          fats: number | null
          id: number
          protein: number | null
          uid: number
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at: string
          fats?: number | null
          id?: number
          protein?: number | null
          uid: number
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          fats?: number | null
          id?: number
          protein?: number | null
          uid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_calories_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      day_templates: {
        Row: {
          day_name: string | null
          id: number
          program_id: number
        }
        Insert: {
          day_name?: string | null
          id?: number
          program_id: number
        }
        Update: {
          day_name?: string | null
          id?: number
          program_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_days_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      days: {
        Row: {
          created_at: string
          id: number
          name: string | null
          uid: number
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          uid: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          uid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_days_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plan: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          type: string
          uid: number
        }
        Insert: {
          amount?: number | null
          created_at: string
          id?: number
          type: string
          uid: number
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          type?: string
          uid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_diet plan_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      lifts: {
        Row: {
          day_id: number
          exercise_id: number | null
          id: number
          notes: string | null
          reps: number | null
          sets: number | null
          weight: number | null
        }
        Insert: {
          day_id: number
          exercise_id?: number | null
          id?: number
          notes?: string | null
          reps?: number | null
          sets?: number | null
          weight?: number | null
        }
        Update: {
          day_id?: number
          exercise_id?: number | null
          id?: number
          notes?: string | null
          reps?: number | null
          sets?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_lifts_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_lifts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      program_templates: {
        Row: {
          id: number
          program_name: string | null
        }
        Insert: {
          id?: number
          program_name?: string | null
        }
        Update: {
          id?: number
          program_name?: string | null
        }
        Relationships: []
      }
      protein: {
        Row: {
          amount: number | null
          created_at: string
          id: number
          uid: number | null
        }
        Insert: {
          amount?: number | null
          created_at: string
          id?: number
          uid?: number | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: number
          uid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_protein_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          birthday: number | null
          email: string | null
          height: string | null
          id: number
          name: string
        }
        Insert: {
          birthday?: number | null
          email?: string | null
          height?: string | null
          id?: number
          name?: string
        }
        Update: {
          birthday?: number | null
          email?: string | null
          height?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      workout_templates: {
        Row: {
          day_id: number
          exercise_id: number | null
          id: number
        }
        Insert: {
          day_id: number
          exercise_id?: number | null
          id?: number
        }
        Update: {
          day_id?: number
          exercise_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_programExercises_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "day_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_programExercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
