
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_hue INT DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by authed" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "users manage own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Memories (shared)
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,       -- 'house' | 'garden' | 'observatory' | 'lake' | 'forest' | 'meadow'
  kind TEXT NOT NULL DEFAULT 'memory', -- 'memory' | 'letter' | 'photo' | 'song'
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  memory_date DATE,
  x REAL,  -- normalized 0-1 position in scene
  y REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.memories TO authenticated;
GRANT ALL ON public.memories TO service_role;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "memories shared read" ON public.memories FOR SELECT TO authenticated USING (true);
CREATE POLICY "authed can add memories" ON public.memories FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "creators can update own" ON public.memories FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "creators can delete own" ON public.memories FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Small notes / left-behind objects
CREATE TABLE public.traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'note',
  text TEXT,
  x REAL DEFAULT 0.5,
  y REAL DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.traces TO authenticated;
GRANT ALL ON public.traces TO service_role;
ALTER TABLE public.traces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "traces shared read" ON public.traces FOR SELECT TO authenticated USING (true);
CREATE POLICY "authed add traces" ON public.traces FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "creators delete own traces" ON public.traces FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- Shared cat
CREATE TABLE public.cat_state (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL DEFAULT 'Mochi',
  mood TEXT NOT NULL DEFAULT 'curious',
  location TEXT NOT NULL DEFAULT 'house',
  last_touched TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.cat_state (id) VALUES (1) ON CONFLICT DO NOTHING;
GRANT SELECT, UPDATE ON public.cat_state TO authenticated;
GRANT ALL ON public.cat_state TO service_role;
ALTER TABLE public.cat_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cat shared read" ON public.cat_state FOR SELECT TO authenticated USING (true);
CREATE POLICY "authed update cat" ON public.cat_state FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
