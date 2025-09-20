-- Create enhanced design system with football theme colors
-- Update existing table and create comprehensive schema for ScoutFutbol platform

-- Drop the existing basic table
DROP TABLE IF EXISTS public.scoutfutbolschema;

-- Create locations table for accurate location data
CREATE TABLE public.countries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.states (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.lgas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state_id UUID REFERENCES public.states(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create players table with comprehensive profile information
CREATE TABLE public.players (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    position TEXT,
    preferred_foot TEXT CHECK (preferred_foot IN ('Left', 'Right', 'Both')),
    height_cm INTEGER,
    weight_kg INTEGER,
    
    -- Agent and professional status
    has_agent BOOLEAN DEFAULT FALSE,
    agent_name TEXT,
    agent_contact TEXT,
    
    -- Professional club status
    plays_professional BOOLEAN DEFAULT FALSE,
    current_club TEXT,
    league_name TEXT,
    
    -- Previous professional experience
    played_pro_before BOOLEAN DEFAULT FALSE,
    itc_number TEXT, -- International Transfer Certificate number
    
    -- Location information
    country_id UUID REFERENCES public.countries(id),
    state_id UUID REFERENCES public.states(id),
    lga_id UUID REFERENCES public.lgas(id),
    
    -- Profile media
    profile_picture_url TEXT,
    
    -- Bio and additional info
    bio TEXT,
    achievements TEXT,
    
    -- Management agreement with WYN
    wyn_management_agreement BOOLEAN DEFAULT FALSE,
    management_start_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create player media table for videos and images (up to 10 slots per player)
CREATE TABLE public.player_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    title TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 1 CHECK (display_order >= 1 AND display_order <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Ensure max 10 media items per player
    UNIQUE(player_id, display_order)
);

-- Create scouts table for club representatives
CREATE TABLE public.scouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    club_name TEXT NOT NULL,
    league TEXT,
    position TEXT,
    country_id UUID REFERENCES public.countries(id),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create negotiations table for WYN middleman services
CREATE TABLE public.negotiations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    scout_id UUID REFERENCES public.scouts(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    offer_details TEXT,
    wyn_commission_percentage DECIMAL(5,2) DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for countries, states, lgas (publicly readable)
CREATE POLICY "Countries are viewable by everyone" ON public.countries FOR SELECT USING (true);
CREATE POLICY "States are viewable by everyone" ON public.states FOR SELECT USING (true);
CREATE POLICY "LGAs are viewable by everyone" ON public.lgas FOR SELECT USING (true);

-- RLS Policies for players
CREATE POLICY "Players can view their own profile" ON public.players 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Players can update their own profile" ON public.players 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Players can insert their own profile" ON public.players 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can view all player profiles" ON public.players 
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for player media
CREATE POLICY "Players can manage their own media" ON public.player_media 
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.players 
        WHERE players.id = player_media.player_id 
        AND players.user_id = auth.uid()
    ));
CREATE POLICY "Authenticated users can view all player media" ON public.player_media 
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for scouts
CREATE POLICY "Scouts can view their own profile" ON public.scouts 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Scouts can update their own profile" ON public.scouts 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Scouts can insert their own profile" ON public.scouts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can view all scout profiles" ON public.scouts 
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for negotiations
CREATE POLICY "Users can view their own negotiations" ON public.negotiations 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.players WHERE players.id = negotiations.player_id AND players.user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.scouts WHERE scouts.id = negotiations.scout_id AND scouts.user_id = auth.uid())
    );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scouts_updated_at BEFORE UPDATE ON public.scouts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_negotiations_updated_at BEFORE UPDATE ON public.negotiations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample location data for Nigeria (primary market)
INSERT INTO public.countries (name, code) VALUES ('Nigeria', 'NG');

-- Get Nigeria's ID for states insertion
DO $$ 
DECLARE 
    nigeria_id UUID;
BEGIN
    SELECT id INTO nigeria_id FROM public.countries WHERE code = 'NG';
    
    -- Insert Nigerian states
    INSERT INTO public.states (country_id, name, code) VALUES
    (nigeria_id, 'Lagos', 'LA'),
    (nigeria_id, 'Abuja FCT', 'FC'),
    (nigeria_id, 'Kano', 'KN'),
    (nigeria_id, 'Rivers', 'RV'),
    (nigeria_id, 'Oyo', 'OY'),
    (nigeria_id, 'Delta', 'DT'),
    (nigeria_id, 'Kaduna', 'KD'),
    (nigeria_id, 'Ogun', 'OG'),
    (nigeria_id, 'Cross River', 'CR'),
    (nigeria_id, 'Anambra', 'AN');
END $$;