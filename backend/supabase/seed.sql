-- ====================================================================
-- TechExpo 2027: Initial Seed Data for Criteria Weights & Schools
-- ====================================================================

-- 1. Insert Initial Configurable Weights
INSERT INTO public.scoring_criteria_weights (id, name, max_points, description)
VALUES 
    ('recent_events', 'Recent Events', 25.00, 'Organized science fairs, robotics challenges, or recent inter-school symposiums'),
    ('reputation', 'Reputation & Academic Standing', 20.00, 'Top-tier accreditation, board examination rank, regional educational prominence'),
    ('existing_connections', 'Existing Connections', 20.00, 'Previous TechExpo participant, faculty relationships, alumni linkages'),
    ('technology_interest', 'Technology & STEM Interest', 20.00, 'Equipped with Atal Tinkering Lab (ATL), active coding/robotics clubs, AI labs'),
    ('ease_of_coordination', 'Ease of Coordination', 15.00, 'Responsive administrative office, quick approval turnaround, nearby logistics')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    max_points = EXCLUDED.max_points,
    description = EXCLUDED.description;

-- 2. Insert Approved TechExpo 2027 Pitch Templates
INSERT INTO public.pitch_templates (id, title, channel, target_audience, template_content)
VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'TechExpo 2027 Official Invitation for School Leadership',
    'Email',
    'Principal',
    'Respected [Principal Name],\n\nGreetings from the Organizing Secretariat of TechExpo 2027 – Gujarat’s Flagship Youth Technology and Innovation Exposition.\n\nWe have closely followed the commendable academic excellence and forward-looking STEM pedagogy fostered at [School Name], [City]. Given your track record in nurturing student innovation, we have the distinct honor of reserving a priority delegation slot for [School Name] at TechExpo 2027, scheduled for January 2027 in Gandhinagar/Ahmedabad.\n\nKey Opportunities for Your Students:\n• Student Innovation Olympiad & Robotics Championship (Grand Cash Prizes & Mentorship)\n• Hands-on Workshops conducted by top Tech Founders and ISRO/IIT mentors\n• 100% Subsidized Exhibition Booths for Top 5 selected school student tech projects\n• Official Participation Credentials & Innovation Laurels for all attendees\n\nWe would welcome an opportunity for a brief 10-minute briefing call with your STEM Coordinator or Vice Principal this week to share the delegation handbook and bus coordination logistics.\n\nWarm regards,\n[Your Name]\nTechExpo 2027 Outreach Directorate\nGovernment & Institutional Relations'
),
(
    '00000000-0000-0000-0000-000000000002',
    'STEM / ATL Coordinator Direct Connect via WhatsApp',
    'WhatsApp',
    'STEM Coordinator',
    'Hello [Coordinator Name] Sir/Ma''am! Hope you are having a productive week at [School Name].\n\nI am reaching out from the TechExpo 2027 School Outreach team. We noticed your stellar initiatives in robotics and STEM, particularly [Evidence Notes].\n\nWe are officially opening registrations for the TechExpo Gujarat Student Tech Pavilion (Jan 2027). Each premier institution can nominate up to 3 student maker teams for the Innovation Challenge.\n\nCould I share a 2-page PDF overview with you over WhatsApp or call you for 3 minutes to discuss student slots?\n\nBest regards,\n[Your Name] | TechExpo 2027 Secretariat'
);
