-- Roles
CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'pharmacist');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Sequences for human-readable IDs
CREATE SEQUENCE public.patient_id_seq START 1001;
CREATE SEQUENCE public.doctor_id_seq START 501;
CREATE SEQUENCE public.pharmacist_id_seq START 301;
CREATE SEQUENCE public.consultation_id_seq START 10001;
CREATE SEQUENCE public.prescription_id_seq START 50001;

-- Patients
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  patient_id TEXT NOT NULL UNIQUE DEFAULT ('AYP-' || lpad(nextval('public.patient_id_seq')::text, 6, '0')),
  date_of_birth DATE,
  age INTEGER,
  gender TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  abha_number TEXT NOT NULL DEFAULT '',
  abha_status TEXT NOT NULL DEFAULT 'Sandbox Verified',
  blood_group TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Doctors
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  doctor_id TEXT NOT NULL UNIQUE DEFAULT ('DOC-' || lpad(nextval('public.doctor_id_seq')::text, 6, '0')),
  state_medical_council TEXT NOT NULL DEFAULT '',
  registration_number TEXT NOT NULL DEFAULT '',
  specialization TEXT NOT NULL DEFAULT '',
  years_experience INTEGER NOT NULL DEFAULT 0,
  hospital_clinic TEXT NOT NULL DEFAULT '',
  verification_status TEXT NOT NULL DEFAULT 'Sandbox Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Pharmacists
CREATE TABLE public.pharmacists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  pharmacist_id TEXT NOT NULL UNIQUE DEFAULT ('PHM-' || lpad(nextval('public.pharmacist_id_seq')::text, 6, '0')),
  registration_number TEXT NOT NULL DEFAULT '',
  state_pharmacy_council TEXT NOT NULL DEFAULT '',
  pharmacy_name TEXT NOT NULL DEFAULT '',
  pharmacy_address TEXT NOT NULL DEFAULT '',
  verification_status TEXT NOT NULL DEFAULT 'Sandbox Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.pharmacists TO authenticated;
GRANT ALL ON public.pharmacists TO service_role;
ALTER TABLE public.pharmacists ENABLE ROW LEVEL SECURITY;

-- Professional verifications
CREATE TABLE public.professional_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  registry TEXT NOT NULL,
  identifier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Sandbox Verified',
  mode TEXT NOT NULL DEFAULT 'sandbox',
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.professional_verifications TO authenticated;
GRANT ALL ON public.professional_verifications TO service_role;
ALTER TABLE public.professional_verifications ENABLE ROW LEVEL SECURITY;

-- Helper lookups
CREATE OR REPLACE FUNCTION public.current_patient_uuid()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.patients WHERE user_id = auth.uid()
$$;
CREATE OR REPLACE FUNCTION public.current_doctor_uuid()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.doctors WHERE user_id = auth.uid()
$$;

-- Patient cases
CREATE TABLE public.patient_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  chief_complaint TEXT NOT NULL,
  presenting_illness TEXT NOT NULL DEFAULT '',
  past_history TEXT NOT NULL DEFAULT '',
  family_history TEXT NOT NULL DEFAULT '',
  allergies TEXT NOT NULL DEFAULT '',
  current_medications TEXT NOT NULL DEFAULT '',
  lifestyle TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.patient_cases TO authenticated;
GRANT ALL ON public.patient_cases TO service_role;
ALTER TABLE public.patient_cases ENABLE ROW LEVEL SECURITY;

-- AYUSH assessments
CREATE TABLE public.ayush_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.patient_cases(id) ON DELETE SET NULL,
  ayush_system TEXT NOT NULL DEFAULT 'Ayurveda',
  prakriti TEXT NOT NULL DEFAULT '',
  vikriti TEXT NOT NULL DEFAULT '',
  agni TEXT NOT NULL DEFAULT '',
  nidra TEXT NOT NULL DEFAULT '',
  ahara TEXT NOT NULL DEFAULT '',
  mala TEXT NOT NULL DEFAULT '',
  manas TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  recorded_by UUID NOT NULL,
  recorded_by_role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ayush_assessments TO authenticated;
GRANT ALL ON public.ayush_assessments TO service_role;
ALTER TABLE public.ayush_assessments ENABLE ROW LEVEL SECURITY;

-- Consultations
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id TEXT NOT NULL UNIQUE DEFAULT ('CON-' || lpad(nextval('public.consultation_id_seq')::text, 6, '0')),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.patient_cases(id) ON DELETE SET NULL,
  examination_findings TEXT NOT NULL DEFAULT '',
  diagnosis TEXT NOT NULL,
  treatment_plan TEXT NOT NULL DEFAULT '',
  advice TEXT NOT NULL DEFAULT '',
  follow_up_date DATE,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Prescriptions
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id TEXT NOT NULL UNIQUE DEFAULT ('RX-' || lpad(nextval('public.prescription_id_seq')::text, 6, '0')),
  consultation_id UUID NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.prescriptions TO authenticated;
GRANT ALL ON public.prescriptions TO service_role;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  form TEXT NOT NULL DEFAULT '',
  dosage TEXT NOT NULL DEFAULT '',
  frequency TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  anupana TEXT NOT NULL DEFAULT '',
  instructions TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT ON public.prescription_items TO authenticated;
GRANT ALL ON public.prescription_items TO service_role;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID,
  actor_role public.app_role,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_patients_updated BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_doctors_updated BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_pharmacists_updated BEFORE UPDATE ON public.pharmacists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_cases_updated BEFORE UPDATE ON public.patient_cases FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_consultations_updated BEFORE UPDATE ON public.consultations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Policies: profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_select_clinical" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'pharmacist') OR public.has_role(auth.uid(), 'patient'));
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- user_roles
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- patients
CREATE POLICY "patients_select" ON public.patients FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'pharmacist'));
CREATE POLICY "patients_update_own" ON public.patients FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- doctors
CREATE POLICY "doctors_select" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "doctors_update_own" ON public.doctors FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- pharmacists
CREATE POLICY "pharmacists_select_own" ON public.pharmacists FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "pharmacists_update_own" ON public.pharmacists FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- professional_verifications
CREATE POLICY "verifications_select_own" ON public.professional_verifications FOR SELECT TO authenticated USING (user_id = auth.uid());

-- patient_cases
CREATE POLICY "cases_select" ON public.patient_cases FOR SELECT TO authenticated
  USING (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "cases_insert" ON public.patient_cases FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor')));
CREATE POLICY "cases_update" ON public.patient_cases FOR UPDATE TO authenticated
  USING (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor'));

-- ayush_assessments
CREATE POLICY "assessments_select" ON public.ayush_assessments FOR SELECT TO authenticated
  USING (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "assessments_insert" ON public.ayush_assessments FOR INSERT TO authenticated
  WITH CHECK (recorded_by = auth.uid() AND (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor')));

-- consultations
CREATE POLICY "consultations_select" ON public.consultations FOR SELECT TO authenticated
  USING (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "consultations_insert_doctor" ON public.consultations FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'doctor') AND doctor_id = public.current_doctor_uuid());
CREATE POLICY "consultations_update_own_doctor" ON public.consultations FOR UPDATE TO authenticated
  USING (doctor_id = public.current_doctor_uuid());

-- prescriptions (no update/delete for anyone)
CREATE POLICY "prescriptions_select" ON public.prescriptions FOR SELECT TO authenticated
  USING (patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'pharmacist'));
CREATE POLICY "prescriptions_insert_doctor" ON public.prescriptions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'doctor') AND doctor_id = public.current_doctor_uuid());

CREATE POLICY "prescription_items_select" ON public.prescription_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_items.prescription_id
    AND (p.patient_id = public.current_patient_uuid() OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'pharmacist'))));
CREATE POLICY "prescription_items_insert_doctor" ON public.prescription_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.prescriptions p WHERE p.id = prescription_items.prescription_id AND p.doctor_id = public.current_doctor_uuid()));

-- audit logs
CREATE POLICY "audit_insert_own" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (actor_user_id = auth.uid());
CREATE POLICY "audit_select_own" ON public.audit_logs FOR SELECT TO authenticated USING (actor_user_id = auth.uid());

-- Indexes
CREATE INDEX idx_cases_patient ON public.patient_cases(patient_id);
CREATE INDEX idx_assessments_patient ON public.ayush_assessments(patient_id);
CREATE INDEX idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX idx_consultations_doctor ON public.consultations(doctor_id);
CREATE INDEX idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX idx_prescription_items_rx ON public.prescription_items(prescription_id);