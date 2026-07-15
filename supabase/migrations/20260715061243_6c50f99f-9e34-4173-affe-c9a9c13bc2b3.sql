
CREATE TABLE public.memory_strips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by uuid NOT NULL,
  image_url text NOT NULL,
  quote text,
  memory_number integer,
  taken_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.memory_strips TO authenticated;
GRANT ALL ON public.memory_strips TO service_role;

ALTER TABLE public.memory_strips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "strips shared read" ON public.memory_strips
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authed can add strips" ON public.memory_strips
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "creators delete own strips" ON public.memory_strips
  FOR DELETE TO authenticated USING (auth.uid() = created_by);
