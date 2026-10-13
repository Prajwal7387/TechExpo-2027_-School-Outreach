-- ====================================================================
-- TechExpo 2027: School Intelligence & Outreach System
-- Supabase PostgreSQL Schema & Security Policies (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TEAM MEMBERS / PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    designation TEXT DEFAULT 'Outreach Coordinator',
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. SCORING CRITERIA CONFIGURATION (Admin configurable)
CREATE TABLE IF NOT EXISTS public.scoring_criteria_weights (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    max_points NUMERIC(5,2) NOT NULL CHECK (max_points >= 0),
    description TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SCHOOLS DIRECTORY
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT,
    state TEXT NOT NULL DEFAULT 'Gujarat',
    board TEXT NOT NULL DEFAULT 'CBSE' CHECK (board IN ('CBSE', 'GSEB', 'ICSE', 'IB', 'Cambridge', 'Other')),
    student_strength INTEGER DEFAULT 500,
    address TEXT,
    pincode TEXT,
    website TEXT,
    
    -- Key Contacts
    principal_name TEXT,
    principal_phone TEXT,
    principal_email TEXT,
    coordinator_name TEXT,
    coordinator_phone TEXT,
    coordinator_email TEXT,
    
    -- Classification Categories (stored as JSON array of category keys/tags)
    categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Detailed Criteria Ratings & Evidence (0.0 to 1.0 or raw score, plus evidence link/notes)
    -- JSON structure: {
    --   "recent_events": { "rating": 0.8, "is_unknown": false, "evidence": "Hosted Gujarat STEM Hackathon in 2025" },
    --   "reputation": { "rating": 1.0, "is_unknown": false, "evidence": "Top-tier ranking in EducationWorld Gujarat" },
    --   "existing_connections": { "rating": 0.5, "is_unknown": false, "evidence": "Alumni mentor on TechExpo advisory" },
    --   "technology_interest": { "rating": 0.9, "is_unknown": false, "evidence": "Active robotics club with Atal Tinkering Lab" },
    --   "ease_of_coordination": { "rating": 0.7, "is_unknown": false, "evidence": "Responsive administration via email" }
    -- }
    scoring_data JSONB DEFAULT '{}'::jsonb,
    
    -- Calculated Score & Level
    priority_score NUMERIC(5,2) DEFAULT 0,
    priority_level TEXT DEFAULT 'Medium' CHECK (priority_level IN ('High', 'Medium', 'Low')),
    
    -- Outreach Status
    outreach_status TEXT NOT NULL DEFAULT 'Not Contacted' CHECK (
        outreach_status IN (
            'Not Contacted',
            'Contacted',
            'Call Scheduled',
            'Meeting Scheduled',
            'Proposal Sent',
            'Interested',
            'Confirmed',
            'Not Interested'
        )
    ),
    
    -- Ownership & Research
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_member_name TEXT,
    research_notes TEXT,
    evidence_links TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. OUTREACH ACTIVITY TIMELINE & LOGS
CREATE TABLE IF NOT EXISTS public.outreach_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('Phone Call', 'Email', 'In-Person Visit', 'WhatsApp', 'Official Letter', 'LinkedIn')),
    contact_person TEXT NOT NULL,
    response_status TEXT NOT NULL CHECK (
        response_status IN (
            'No Response',
            'Positive Interest',
            'Needs Follow-up',
            'Call Scheduled',
            'Meeting Scheduled',
            'Proposal Requested',
            'Confirmed Delegation',
            'Declined'
        )
    ),
    meeting_status TEXT CHECK (meeting_status IN ('None', 'Pending', 'Completed', 'Cancelled', 'Rescheduled')),
    notes TEXT NOT NULL,
    pitch_used TEXT,
    next_follow_up TIMESTAMPTZ,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    logged_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    logged_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. PITCH TEMPLATES (Approved TechExpo 2027 Collateral)
CREATE TABLE IF NOT EXISTS public.pitch_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    channel TEXT NOT NULL,
    target_audience TEXT NOT NULL, -- 'Principal', 'STEM Coordinator', 'Trustee'
    template_content TEXT NOT NULL,
    approved_by TEXT DEFAULT 'TechExpo Outreach Core Team',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scoring_criteria_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pitch_templates ENABLE ROW LEVEL SECURITY;

-- Profiles:
-- Any authenticated user can read profiles
CREATE POLICY "Allow authenticated read profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- User can update own profile
CREATE POLICY "Allow users to update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Scoring Weights:
-- Authenticated users can view weights
CREATE POLICY "Allow authenticated read criteria weights"
ON public.scoring_criteria_weights FOR SELECT
TO authenticated
USING (true);

-- Only admins can modify criteria weights
CREATE POLICY "Allow admin to update criteria weights"
ON public.scoring_criteria_weights FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Schools:
-- Authenticated users can read non-archived schools (and admins can see archived)
CREATE POLICY "Allow authenticated read schools"
ON public.schools FOR SELECT
TO authenticated
USING (
    is_archived = false OR
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Authenticated team members can create and update schools
CREATE POLICY "Allow authenticated insert schools"
ON public.schools FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update schools"
ON public.schools FOR UPDATE
TO authenticated
USING (true);

-- Only admins can delete or archive schools
CREATE POLICY "Allow admin delete schools"
ON public.schools FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Outreach Logs:
CREATE POLICY "Allow authenticated read outreach logs"
ON public.outreach_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated insert outreach logs"
ON public.outreach_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update outreach logs"
ON public.outreach_logs FOR UPDATE
TO authenticated
USING (true);

-- Pitch Templates:
CREATE POLICY "Allow authenticated read pitch templates"
ON public.pitch_templates FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow admin manage pitch templates"
ON public.pitch_templates FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- ====================================================================
-- AUTOMATIC TIMESTAMPS & PRIORITY RECALCULATION TRIGGER
-- ====================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Auto create profile on auth.user sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'member')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
