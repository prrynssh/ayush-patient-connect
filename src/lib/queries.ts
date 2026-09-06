import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () =>
      unwrap(await supabase.from("profiles").select("*").eq("id", userId).single()),
  });

export const myPatientQuery = (userId: string) =>
  queryOptions({
    queryKey: ["patient", "me", userId],
    queryFn: async () =>
      unwrap(await supabase.from("patients").select("*").eq("user_id", userId).single()),
  });

export const myDoctorQuery = (userId: string) =>
  queryOptions({
    queryKey: ["doctor", "me", userId],
    queryFn: async () =>
      unwrap(await supabase.from("doctors").select("*").eq("user_id", userId).single()),
  });

export const myPharmacistQuery = (userId: string) =>
  queryOptions({
    queryKey: ["pharmacist", "me", userId],
    queryFn: async () =>
      unwrap(await supabase.from("pharmacists").select("*").eq("user_id", userId).single()),
  });

export const myVerificationQuery = (userId: string) =>
  queryOptions({
    queryKey: ["verification", userId],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("professional_verifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ),
  });

export const patientByUuidQuery = (uuid: string) =>
  queryOptions({
    queryKey: ["patient", uuid],
    queryFn: async () => {
      const patient = unwrap(await supabase.from("patients").select("*").eq("id", uuid).single());
      const profile = unwrap(
        await supabase
          .from("profiles")
          .select("full_name, mobile, email")
          .eq("id", patient.user_id)
          .maybeSingle(),
      );
      return { ...patient, profile };
    },
  });

export const casesQuery = (patientUuid: string) =>
  queryOptions({
    queryKey: ["cases", patientUuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("patient_cases")
          .select("*")
          .eq("patient_id", patientUuid)
          .order("created_at", { ascending: false }),
      ),
  });

export const assessmentsQuery = (patientUuid: string) =>
  queryOptions({
    queryKey: ["assessments", patientUuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("ayush_assessments")
          .select("*")
          .eq("patient_id", patientUuid)
          .order("created_at", { ascending: false }),
      ),
  });

export const CONSULTATION_SELECT =
  "*, doctors(doctor_id, specialization, hospital_clinic, user_id, profiles:user_id(full_name)), patients(patient_id, user_id), prescriptions(id, prescription_id)";

export const consultationsForPatientQuery = (patientUuid: string) =>
  queryOptions({
    queryKey: ["consultations", "patient", patientUuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("consultations")
          .select("*, doctors(doctor_id, specialization, hospital_clinic, user_id), prescriptions(id, prescription_id)")
          .eq("patient_id", patientUuid)
          .order("created_at", { ascending: false }),
      ),
  });

export const consultationsForDoctorQuery = (doctorUuid: string) =>
  queryOptions({
    queryKey: ["consultations", "doctor", doctorUuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("consultations")
          .select("*, patients(id, patient_id, user_id), prescriptions(id, prescription_id)")
          .eq("doctor_id", doctorUuid)
          .order("created_at", { ascending: false }),
      ),
  });

export const consultationDetailQuery = (uuid: string) =>
  queryOptions({
    queryKey: ["consultation", uuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("consultations")
          .select(
            "*, doctors(doctor_id, specialization, hospital_clinic, user_id), patients(id, patient_id, user_id, age, gender), prescriptions(id, prescription_id, notes, created_at, prescription_items(*))",
          )
          .eq("id", uuid)
          .single(),
      ),
  });

export const prescriptionsForPatientQuery = (patientUuid: string) =>
  queryOptions({
    queryKey: ["prescriptions", "patient", patientUuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("prescriptions")
          .select(
            "*, doctors(doctor_id, specialization, hospital_clinic, user_id), consultations(consultation_id, diagnosis), prescription_items(id)",
          )
          .eq("patient_id", patientUuid)
          .order("created_at", { ascending: false }),
      ),
  });

export const prescriptionDetailQuery = (uuid: string) =>
  queryOptions({
    queryKey: ["prescription", uuid],
    queryFn: async () =>
      unwrap(
        await supabase
          .from("prescriptions")
          .select(
            "*, doctors(doctor_id, specialization, hospital_clinic, registration_number, user_id), patients(id, patient_id, age, gender, user_id), consultations(consultation_id, diagnosis, advice, follow_up_date, created_at), prescription_items(*)",
          )
          .eq("id", uuid)
          .single(),
      ),
  });

/** Names for a set of user ids (RLS allows signed-in clinical users to read profiles). */
export const namesQuery = (userIds: string[]) =>
  queryOptions({
    queryKey: ["names", [...userIds].sort()],
    enabled: userIds.length > 0,
    queryFn: async () => {
      const rows = unwrap(
        await supabase.from("profiles").select("id, full_name").in("id", userIds),
      );
      return Object.fromEntries(rows.map((r) => [r.id, r.full_name])) as Record<string, string>;
    },
  });
