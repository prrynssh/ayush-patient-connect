import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const base = {
  full_name: z.string().trim().min(2, "Full name is required"),
  mobile: z.string().trim().min(10, "Enter a valid mobile number").max(15),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
};

export const patientSchema = z.object({
  role: z.literal("patient"),
  ...base,
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  address: z.string().trim().min(3, "Address is required"),
  abha_number: z.string().trim().min(6, "Enter your 14-digit ABHA number"),
});

export const doctorSchema = z.object({
  role: z.literal("doctor"),
  ...base,
  state_medical_council: z.string().min(1, "Select your State Medical Council"),
  registration_number: z.string().trim().min(3, "Registration number is required"),
  specialization: z.string().min(1, "Select a specialization"),
  years_experience: z.coerce.number().int().min(0).max(70),
  hospital_clinic: z.string().trim().min(2, "Hospital / clinic is required"),
});

export const pharmacistSchema = z.object({
  role: z.literal("pharmacist"),
  ...base,
  registration_number: z.string().trim().min(3, "Registration number is required"),
  state_pharmacy_council: z.string().min(1, "Select your State Pharmacy Council"),
  pharmacy_name: z.string().trim().min(2, "Pharmacy name is required"),
  pharmacy_address: z.string().trim().min(3, "Pharmacy address is required"),
});

export const registrationSchema = z.discriminatedUnion("role", [
  patientSchema,
  doctorSchema,
  pharmacistSchema,
]);

export type RegistrationInput = z.infer<typeof registrationSchema>;

function ageFromDob(dob: string) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

/**
 * Registers a new account. Runs entirely on the server with privileged access so
 * that role assignment and ID generation can never be tampered with from the browser.
 * Accounts are activated immediately (prototype mode) and verification is recorded
 * against a sandbox registry (ABDM / NMC / PCI).
 */
export const registerUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name, role: data.role },
    });
    if (createErr || !created.user) {
      const msg = createErr?.message ?? "Could not create account";
      throw new Error(/already/i.test(msg) ? "An account with this email already exists" : msg);
    }
    const userId = created.user.id;

    const rollback = async (reason: string) => {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error(reason);
    };

    const { error: profileErr } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name: data.full_name,
      email: data.email,
      mobile: data.mobile,
    });
    if (profileErr) await rollback(profileErr.message);

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: data.role });
    if (roleErr) await rollback(roleErr.message);

    let generatedId = "";
    let registry = "";
    let identifier = "";

    if (data.role === "patient") {
      const { data: row, error } = await supabaseAdmin
        .from("patients")
        .insert({
          user_id: userId,
          date_of_birth: data.date_of_birth,
          age: ageFromDob(data.date_of_birth),
          gender: data.gender,
          address: data.address,
          abha_number: data.abha_number,
          abha_status: "Sandbox Verified",
        })
        .select("patient_id")
        .single();
      if (error || !row) await rollback(error?.message ?? "Could not create patient record");
      generatedId = row!.patient_id;
      registry = "ABDM";
      identifier = data.abha_number;
    } else if (data.role === "doctor") {
      const { data: row, error } = await supabaseAdmin
        .from("doctors")
        .insert({
          user_id: userId,
          state_medical_council: data.state_medical_council,
          registration_number: data.registration_number,
          specialization: data.specialization,
          years_experience: data.years_experience,
          hospital_clinic: data.hospital_clinic,
          verification_status: "Sandbox Verified",
        })
        .select("doctor_id")
        .single();
      if (error || !row) await rollback(error?.message ?? "Could not create doctor record");
      generatedId = row!.doctor_id;
      registry = "NMC";
      identifier = data.registration_number;
    } else {
      const { data: row, error } = await supabaseAdmin
        .from("pharmacists")
        .insert({
          user_id: userId,
          registration_number: data.registration_number,
          state_pharmacy_council: data.state_pharmacy_council,
          pharmacy_name: data.pharmacy_name,
          pharmacy_address: data.pharmacy_address,
          verification_status: "Sandbox Verified",
        })
        .select("pharmacist_id")
        .single();
      if (error || !row) await rollback(error?.message ?? "Could not create pharmacist record");
      generatedId = row!.pharmacist_id;
      registry = "PCI";
      identifier = data.registration_number;
    }

    await supabaseAdmin.from("professional_verifications").insert({
      user_id: userId,
      role: data.role,
      registry,
      identifier,
      status: "Sandbox Verified",
      mode: "sandbox",
    });

    await supabaseAdmin.from("audit_logs").insert({
      actor_user_id: userId,
      actor_role: data.role,
      action: "REGISTER",
      entity_type: data.role,
      entity_id: generatedId,
      details: { registry, mode: "sandbox" },
    });

    return { role: data.role, generatedId };
  });
