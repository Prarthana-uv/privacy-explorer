-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create privacy scans table
CREATE TABLE public.privacy_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    privacy_score INTEGER NOT NULL DEFAULT 0,
    total_trackers INTEGER NOT NULL DEFAULT 0,
    total_cookies INTEGER NOT NULL DEFAULT 0,
    total_permissions INTEGER NOT NULL DEFAULT 0,
    fingerprinting_scripts INTEGER NOT NULL DEFAULT 0,
    ai_analysis TEXT,
    scan_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on privacy_scans
ALTER TABLE public.privacy_scans ENABLE ROW LEVEL SECURITY;

-- Privacy scans policies
CREATE POLICY "Users can view own scans" 
ON public.privacy_scans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans" 
ON public.privacy_scans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scans" 
ON public.privacy_scans FOR DELETE 
USING (auth.uid() = user_id);

-- Create detected trackers table
CREATE TABLE public.detected_trackers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES public.privacy_scans(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tracker_name TEXT NOT NULL,
    tracker_category TEXT NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    count INTEGER NOT NULL DEFAULT 1,
    domain TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on detected_trackers
ALTER TABLE public.detected_trackers ENABLE ROW LEVEL SECURITY;

-- Detected trackers policies
CREATE POLICY "Users can view own trackers" 
ON public.detected_trackers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trackers" 
ON public.detected_trackers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trackers" 
ON public.detected_trackers FOR DELETE 
USING (auth.uid() = user_id);

-- Create recommendations table
CREATE TABLE public.privacy_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID REFERENCES public.privacy_scans(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    impact TEXT NOT NULL CHECK (impact IN ('low', 'medium', 'high')),
    action_label TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on recommendations
ALTER TABLE public.privacy_recommendations ENABLE ROW LEVEL SECURITY;

-- Recommendations policies
CREATE POLICY "Users can view own recommendations" 
ON public.privacy_recommendations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations" 
ON public.privacy_recommendations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations" 
ON public.privacy_recommendations FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto-profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at trigger to profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();