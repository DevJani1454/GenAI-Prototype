/*
  # Career Advisor Platform Schema

  ## Overview
  This migration creates the complete database schema for the AI-powered career advisor platform.
  It includes tables for user profiles, goals, skills, courses, mentors, credentials, and more.

  ## New Tables
  
  1. **user_profiles** - Extended user profile information
  2. **user_goals** - Career goals and milestones tracking
  3. **user_skills** - User skills and proficiency mapping
  4. **skill_gaps** - Skills gap identification
  5. **courses** - Course catalog
  6. **user_courses** - Course enrollment and progress
  7. **mentors** - Mentor profiles
  8. **mentor_sessions** - Mentoring session tracking
  9. **credentials** - Blockchain-secured credentials
  10. **career_personas** - AI-generated career personas
  11. **peer_benchmarks** - Peer comparison data
  12. **motivational_stories** - AI-generated success stories
  13. **regret_reflections** - Regret minimization reflections
  14. **chat_history** - Career Navigator GPT conversations
  15. **user_settings** - User preferences and settings

  ## Security
  - Enable RLS on all tables
  - Policies ensure users can only access their own data
  - Public access to courses and motivational stories
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date_of_birth date,
  current_education text,
  field_of_study text,
  graduation_year integer,
  work_experience jsonb DEFAULT '[]'::jsonb,
  job_title text,
  career_goals text[],
  preferred_industries text[],
  persona_data jsonb,
  resume_url text,
  profile_picture_url text,
  location_city text,
  location_country text DEFAULT 'India',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  target_role text,
  target_date date,
  timeline_months integer,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  ai_recommendations jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Skills Table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name text NOT NULL,
  category text,
  proficiency_level integer DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  is_verified boolean DEFAULT false,
  source text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_name)
);

-- Skill Gaps Table
CREATE TABLE IF NOT EXISTS skill_gaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  goal_id uuid REFERENCES user_goals(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  current_level integer DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 5),
  required_level integer DEFAULT 3 CHECK (required_level >= 1 AND required_level <= 5),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  recommended_courses text[],
  created_at timestamptz DEFAULT now()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  provider text,
  category text,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours integer,
  prerequisites text[],
  skills_covered text[],
  rating numeric(3, 2) DEFAULT 0.0,
  enrollment_count integer DEFAULT 0,
  course_url text,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Courses Table
CREATE TABLE IF NOT EXISTS user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  enrollment_date timestamptz DEFAULT now(),
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completion_date timestamptz,
  certificate_url text,
  status text DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  title text,
  company text,
  expertise_areas text[],
  years_experience integer,
  bio text,
  hourly_rate numeric(10, 2),
  availability jsonb,
  rating numeric(3, 2) DEFAULT 0.0,
  total_sessions integer DEFAULT 0,
  profile_picture_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Mentor Sessions Table
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES mentors(id) ON DELETE CASCADE NOT NULL,
  mentee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scheduled_at timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  meeting_link text,
  notes text,
  feedback_rating integer CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment text,
  created_at timestamptz DEFAULT now()
);

-- Credentials Table
CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credential_type text NOT NULL,
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  credential_url text,
  blockchain_hash text,
  qr_code_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expired', 'revoked')),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Career Personas Table
CREATE TABLE IF NOT EXISTS career_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  persona_type text,
  strengths text[],
  weaknesses text[],
  recommended_paths text[],
  personality_traits jsonb,
  learning_style text,
  motivation_factors text[],
  risk_tolerance text CHECK (risk_tolerance IN ('low', 'medium', 'high')),
  generated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Peer Benchmarks Table
CREATE TABLE IF NOT EXISTS peer_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comparison_group text,
  metric_name text NOT NULL,
  user_value numeric,
  peer_average numeric,
  percentile_rank integer CHECK (percentile_rank >= 0 AND percentile_rank <= 100),
  created_at timestamptz DEFAULT now()
);

-- Motivational Stories Table
CREATE TABLE IF NOT EXISTS motivational_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_audience text,
  story_content text NOT NULL,
  career_path text,
  key_insights text[],
  generated_by_ai boolean DEFAULT true,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Regret Reflections Table
CREATE TABLE IF NOT EXISTS regret_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reflection_prompt text NOT NULL,
  user_response text,
  ai_analysis text,
  anti_regret_plan jsonb,
  reminder_frequency text DEFAULT 'weekly' CHECK (reminder_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  last_reminder_sent timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  context_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
  language text DEFAULT 'en',
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  accessibility_features jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE motivational_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE regret_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_skills
CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for skill_gaps
CREATE POLICY "Users can view own skill gaps"
  ON skill_gaps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill gaps"
  ON skill_gaps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for courses
CREATE POLICY "Anyone can view active courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for user_courses
CREATE POLICY "Users can view own course enrollments"
  ON user_courses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
  ON user_courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress"
  ON user_courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mentors
CREATE POLICY "Anyone can view active mentors"
  ON mentors FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for mentor_sessions
CREATE POLICY "Users can view own mentor sessions"
  ON mentor_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = mentee_id OR auth.uid() IN (SELECT user_id FROM mentors WHERE mentors.id = mentor_id));

CREATE POLICY "Users can book mentor sessions"
  ON mentor_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentee_id);

CREATE POLICY "Users can update own sessions"
  ON mentor_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = mentee_id OR auth.uid() IN (SELECT user_id FROM mentors WHERE mentors.id = mentor_id))
  WITH CHECK (auth.uid() = mentee_id OR auth.uid() IN (SELECT user_id FROM mentors WHERE mentors.id = mentor_id));

-- RLS Policies for credentials
CREATE POLICY "Users can view own credentials"
  ON credentials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credentials"
  ON credentials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credentials"
  ON credentials FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for career_personas
CREATE POLICY "Users can view own persona"
  ON career_personas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own persona"
  ON career_personas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own persona"
  ON career_personas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for peer_benchmarks
CREATE POLICY "Users can view own benchmarks"
  ON peer_benchmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for motivational_stories
CREATE POLICY "Anyone can view motivational stories"
  ON motivational_stories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for regret_reflections
CREATE POLICY "Users can view own reflections"
  ON regret_reflections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
  ON regret_reflections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
  ON regret_reflections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_history
CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user_id ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentee_id ON mentor_sessions(mentee_id);
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_mentors_expertise ON mentors USING gin(expertise_areas);