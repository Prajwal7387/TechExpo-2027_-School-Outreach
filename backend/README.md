# TechExpo 2027 — Database Schemas & Seed Data (Optional)

This directory contains optional PostgreSQL / Supabase schemas and seed scripts for **TechExpo 2027: School Intelligence & Outreach System**.

> **Note:** The frontend application runs out-of-the-box using browser `localStorage` and does not require an external database to operate. These SQL scripts are provided for teams wishing to deploy a central PostgreSQL/Supabase database.

## Files
- `supabase/schema.sql`: Complete PostgreSQL schema with tables (`schools`, `profiles`, `scoring_criteria_weights`, `outreach_logs`, `pitch_templates`), Row Level Security (RLS) policies, and triggers.
- `supabase/seed.sql`: Seed data for scoring criteria weights and approved pitch collateral.
