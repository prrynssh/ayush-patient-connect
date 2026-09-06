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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_role: Database["public"]["Enums"]["app_role"] | null
          actor_user_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_role?: Database["public"]["Enums"]["app_role"] | null
          actor_user_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_role?: Database["public"]["Enums"]["app_role"] | null
          actor_user_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      ayush_assessments: {
        Row: {
          agni: string
          ahara: string
          ayush_system: string
          case_id: string | null
          created_at: string
          id: string
          mala: string
          manas: string
          nidra: string
          notes: string
          patient_id: string
          prakriti: string
          recorded_by: string
          recorded_by_role: Database["public"]["Enums"]["app_role"]
          vikriti: string
        }
        Insert: {
          agni?: string
          ahara?: string
          ayush_system?: string
          case_id?: string | null
          created_at?: string
          id?: string
          mala?: string
          manas?: string
          nidra?: string
          notes?: string
          patient_id: string
          prakriti?: string
          recorded_by: string
          recorded_by_role: Database["public"]["Enums"]["app_role"]
          vikriti?: string
        }
        Update: {
          agni?: string
          ahara?: string
          ayush_system?: string
          case_id?: string | null
          created_at?: string
          id?: string
          mala?: string
          manas?: string
          nidra?: string
          notes?: string
          patient_id?: string
          prakriti?: string
          recorded_by?: string
          recorded_by_role?: Database["public"]["Enums"]["app_role"]
          vikriti?: string
        }
        Relationships: [
          {
            foreignKeyName: "ayush_assessments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "patient_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ayush_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          advice: string
          case_id: string | null
          consultation_id: string
          created_at: string
          diagnosis: string
          doctor_id: string
          examination_findings: string
          follow_up_date: string | null
          id: string
          patient_id: string
          status: string
          treatment_plan: string
          updated_at: string
        }
        Insert: {
          advice?: string
          case_id?: string | null
          consultation_id?: string
          created_at?: string
          diagnosis: string
          doctor_id: string
          examination_findings?: string
          follow_up_date?: string | null
          id?: string
          patient_id: string
          status?: string
          treatment_plan?: string
          updated_at?: string
        }
        Update: {
          advice?: string
          case_id?: string | null
          consultation_id?: string
          created_at?: string
          diagnosis?: string
          doctor_id?: string
          examination_findings?: string
          follow_up_date?: string | null
          id?: string
          patient_id?: string
          status?: string
          treatment_plan?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "patient_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          created_at: string
          doctor_id: string
          hospital_clinic: string
          id: string
          registration_number: string
          specialization: string
          state_medical_council: string
          updated_at: string
          user_id: string
          verification_status: string
          years_experience: number
        }
        Insert: {
          created_at?: string
          doctor_id?: string
          hospital_clinic?: string
          id?: string
          registration_number?: string
          specialization?: string
          state_medical_council?: string
          updated_at?: string
          user_id: string
          verification_status?: string
          years_experience?: number
        }
        Update: {
          created_at?: string
          doctor_id?: string
          hospital_clinic?: string
          id?: string
          registration_number?: string
          specialization?: string
          state_medical_council?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          years_experience?: number
        }
        Relationships: []
      }
      patient_cases: {
        Row: {
          allergies: string
          chief_complaint: string
          created_at: string
          created_by: string
          current_medications: string
          family_history: string
          id: string
          lifestyle: string
          past_history: string
          patient_id: string
          presenting_illness: string
          status: string
          updated_at: string
        }
        Insert: {
          allergies?: string
          chief_complaint: string
          created_at?: string
          created_by: string
          current_medications?: string
          family_history?: string
          id?: string
          lifestyle?: string
          past_history?: string
          patient_id: string
          presenting_illness?: string
          status?: string
          updated_at?: string
        }
        Update: {
          allergies?: string
          chief_complaint?: string
          created_at?: string
          created_by?: string
          current_medications?: string
          family_history?: string
          id?: string
          lifestyle?: string
          past_history?: string
          patient_id?: string
          presenting_illness?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          abha_number: string
          abha_status: string
          address: string
          age: number | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          gender: string
          id: string
          patient_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          abha_number?: string
          abha_status?: string
          address?: string
          age?: number | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string
          id?: string
          patient_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          abha_number?: string
          abha_status?: string
          address?: string
          age?: number | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          gender?: string
          id?: string
          patient_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacists: {
        Row: {
          created_at: string
          id: string
          pharmacist_id: string
          pharmacy_address: string
          pharmacy_name: string
          registration_number: string
          state_pharmacy_council: string
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          pharmacist_id?: string
          pharmacy_address?: string
          pharmacy_name?: string
          registration_number?: string
          state_pharmacy_council?: string
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          pharmacist_id?: string
          pharmacy_address?: string
          pharmacy_name?: string
          registration_number?: string
          state_pharmacy_council?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      prescription_items: {
        Row: {
          anupana: string
          dosage: string
          duration: string
          form: string
          frequency: string
          id: string
          instructions: string
          medicine_name: string
          prescription_id: string
          sort_order: number
        }
        Insert: {
          anupana?: string
          dosage?: string
          duration?: string
          form?: string
          frequency?: string
          id?: string
          instructions?: string
          medicine_name: string
          prescription_id: string
          sort_order?: number
        }
        Update: {
          anupana?: string
          dosage?: string
          duration?: string
          form?: string
          frequency?: string
          id?: string
          instructions?: string
          medicine_name?: string
          prescription_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          consultation_id: string
          created_at: string
          doctor_id: string
          id: string
          notes: string
          patient_id: string
          prescription_id: string
          status: string
        }
        Insert: {
          consultation_id: string
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string
          patient_id: string
          prescription_id?: string
          status?: string
        }
        Update: {
          consultation_id?: string
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string
          patient_id?: string
          prescription_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_verifications: {
        Row: {
          created_at: string
          id: string
          identifier: string
          mode: string
          registry: string
          role: Database["public"]["Enums"]["app_role"]
          status: string
          user_id: string
          verified_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          identifier: string
          mode?: string
          registry: string
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          user_id: string
          verified_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          mode?: string
          registry?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          user_id?: string
          verified_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          mobile: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          mobile?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          mobile?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_doctor_uuid: { Args: never; Returns: string }
      current_patient_uuid: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "pharmacist"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["patient", "doctor", "pharmacist"],
    },
  },
} as const
