# AYUSH Patient Connect

Build a complete working prototype called AYUSH Patient Case-Taking & Consultation System.

This is a healthcare workflow prototype for an SIH project. Prioritize a functional demo, clean UI, and the complete user journey over external integrations.

TECH STACK:

React + TypeScript

Tailwind CSS

shadcn/ui or equivalent modern component library

Use Lovable's built-in backend/database/auth if available

Do NOT integrate real ABDM, NMC, PCI or government APIs yet

Use mock/sandbox verification data

USER ROLES:

Patient

Doctor

Pharmacist

Create a professional healthcare dashboard with responsive desktop/mobile UI.

AUTHENTICATION:
Create login and registration flows with role selection.

PATIENT REGISTRATION:

Full name

Date of birth / age

Gender

Mobile number

Email

Address

ABHA number

Password

Generate a unique Patient ID after registration

Show ABHA status as "Sandbox Verified" for prototype purposes

DOCTOR REGISTRATION:

Full name

Mobile

Email

State Medical Council

Medical Registration Number

Specialization

Years of experience

Hospital/Clinic

Password

Generate Doctor ID

Show professional verification as "Sandbox Verified"

PHARMACIST REGISTRATION:

Full name

Mobile

Email

Pharmacist Registration Number

State Pharmacy Council

Pharmacy name

Pharmacy address

Password

Generate Pharmacist ID

Show professional verification as "Sandbox Verified"

Create separate dashboards:

PATIENT DASHBOARD:

Patient ID

ABHA status

Start Case Taking

General Medical History

AYUSH Assessment

Consultations

Prescriptions

Profile

DOCTOR DASHBOARD:

Doctor profile and verification status

Search patient by Patient ID

View patient case history

Start consultation

Record assessment

Create prescription

View previous consultations

PHARMACIST DASHBOARD:

Search Patient ID

View prescriptions belonging to that patient

View prescription details

Do not allow prescription editing

DATABASE:
Create proper relational database structures for:

users

patients

doctors

pharmacists

professional_verifications

patient_cases

ayush_assessments

consultations

prescriptions

prescription_items

audit_logs

Use relationships between Patient ID, Doctor ID, Consultation ID and Prescription ID.

IMPORTANT:

Do not use fake browser-only localStorage as the main database.

Persist important records through the backend/database.

Enforce role-based access in backend logic where possible.

Never expose passwords or secrets in frontend code.

DESIGN:

Clean modern medical dashboard

White/light interface with professional blue/teal accents

Cards, tables, forms and clear status badges

Sidebar navigation for dashboards

Clear Patient ID / Doctor ID / Pharmacist ID

Make the application feel like a real hospital information system

Do not spend effort on real external API integration.
Do not create unnecessary pages.
Make the core application navigable and functional.
Continue building until the foundation is working.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e868816e-22fa-4fe1-b570-17294a1ba45f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
