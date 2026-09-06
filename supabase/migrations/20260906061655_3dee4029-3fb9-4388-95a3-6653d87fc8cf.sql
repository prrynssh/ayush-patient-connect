REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_patient_uuid() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_doctor_uuid() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_patient_uuid() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_doctor_uuid() TO authenticated, service_role;