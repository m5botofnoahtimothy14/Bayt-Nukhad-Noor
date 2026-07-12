-- Shared realtime state (fireplace lit level, vinyl now-playing, lamp on/off, etc.)
CREATE TABLE public.shared_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.shared_state TO authenticated;
GRANT ALL ON public.shared_state TO service_role;

ALTER TABLE public.shared_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Any signed-in user can read shared state"
  ON public.shared_state FOR SELECT TO authenticated USING (true);

CREATE POLICY "Any signed-in user can write shared state"
  ON public.shared_state FOR INSERT TO authenticated WITH CHECK (auth.uid() = updated_by);

CREATE POLICY "Any signed-in user can update shared state"
  ON public.shared_state FOR UPDATE TO authenticated USING (true) WITH CHECK (auth.uid() = updated_by);

ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_state;
ALTER TABLE public.shared_state REPLICA IDENTITY FULL;

-- Add optional timezone to profiles for the dual clock (safe if profiles exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_role TEXT; -- 'noah' | 'khadija'