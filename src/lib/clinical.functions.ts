import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = {
  supabase: import("@supabase/supabase-js").SupabaseClient<
    import("@/integrations/supabase/types").Database
  >;
  userId: string;
};

async function requireRole(ctx: Ctx, roles: Array<"patient" | "doctor" | "pharmacist">) {
  const { data } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId)
    .maybeSingle();
  if (!data || !roles.includes(data.role)) {
    throw new Error("Forbidden: your role is not allowed to perform this action");
  }
  return data.role;
}

/** Doctor / pharmacist: find a patient by their human-readable Patient ID. */
export const lookupPatient = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ patientId: z.string().trim().min(3) }).parse(d))
  .handler(async ({ data, context }) => {
    const role = await requireRole(context, ["doctor", "pharmacist"]);
    const pid = data.patientId.toUpperCase();
    const { data: patient, error } = await context.supabase
      .from("patients")
      .select("id, patient_id, gender, age, date_of_birth, abha_number, abha_status, address, user_id")
      .eq("patient_id", pid)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!patient) return { patient: null };

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name, mobile, email")
      .eq("id", patient.user_id)
      .maybeSingle();

    await context.supabase.from("audit_logs").insert({
      actor_user_id: context.userId,
      actor_role: role,
      action: "LOOKUP_PATIENT",
      entity_type: "patient",
      entity_id: patient.patient_id,
    });

    return { patient: { ...patient, profile } };
  });

const itemSchema = z.object({
  medicine_name: z.string().trim().min(1, "Medicine name is required"),
  form: z.string().default(""),
  dosage: z.string().default(""),
  frequency: z.string().default(""),
  duration: z.string().default(""),
  anupana: z.string().default(""),
  instructions: z.string().default(""),
});

export const consultationSchema = z.object({
  patientUuid: z.string().uuid(),
  caseId: z.string().uuid().nullable().optional(),
  examination_findings: z.string().default(""),
  diagnosis: z.string().trim().min(2, "Diagnosis is required"),
  treatment_plan: z.string().default(""),
  advice: z.string().default(""),
  follow_up_date: z.string().nullable().optional(),
  prescription: z
    .object({
      notes: z.string().default(""),
      items: z.array(itemSchema).min(1, "Add at least one medicine"),
    })
    .nullable()
    .optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

/** Doctor: record a consultation and (optionally) issue a prescription in one step. */
export const createConsultation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => consultationSchema.parse(d))
  .handler(async ({ data, context }) => {
    await requireRole(context, ["doctor"]);
    const { data: doctor } = await context.supabase
      .from("doctors")
      .select("id, doctor_id")
      .eq("user_id", context.userId)
      .single();
    if (!doctor) throw new Error("Doctor profile not found");

    const { data: consultation, error } = await context.supabase
      .from("consultations")
      .insert({
        patient_id: data.patientUuid,
        doctor_id: doctor.id,
        case_id: data.caseId ?? null,
        examination_findings: data.examination_findings,
        diagnosis: data.diagnosis,
        treatment_plan: data.treatment_plan,
        advice: data.advice,
        follow_up_date: data.follow_up_date || null,
        status: "completed",
      })
      .select("id, consultation_id")
      .single();
    if (error || !consultation) throw new Error(error?.message ?? "Could not save consultation");

    let prescriptionId: string | null = null;
    let prescriptionUuid: string | null = null;

    if (data.prescription) {
      const { data: rx, error: rxErr } = await context.supabase
        .from("prescriptions")
        .insert({
          consultation_id: consultation.id,
          patient_id: data.patientUuid,
          doctor_id: doctor.id,
          notes: data.prescription.notes,
        })
        .select("id, prescription_id")
        .single();
      if (rxErr || !rx) throw new Error(rxErr?.message ?? "Could not save prescription");

      const { error: itemsErr } = await context.supabase.from("prescription_items").insert(
        data.prescription.items.map((it, i) => ({ ...it, prescription_id: rx.id, sort_order: i })),
      );
      if (itemsErr) throw new Error(itemsErr.message);
      prescriptionId = rx.prescription_id;
      prescriptionUuid = rx.id;
    }

    if (data.caseId) {
      await context.supabase
        .from("patient_cases")
        .update({ status: "under_treatment" })
        .eq("id", data.caseId);
    }

    await context.supabase.from("audit_logs").insert({
      actor_user_id: context.userId,
      actor_role: "doctor",
      action: "CREATE_CONSULTATION",
      entity_type: "consultation",
      entity_id: consultation.consultation_id,
      details: { prescription_id: prescriptionId, doctor_id: doctor.doctor_id },
    });

    return {
      consultationUuid: consultation.id,
      consultationId: consultation.consultation_id,
      prescriptionId,
      prescriptionUuid,
    };
  });
