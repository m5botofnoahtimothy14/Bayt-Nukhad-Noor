CREATE TABLE IF NOT EXISTS public.memory_strips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  image_url TEXT NOT NULL,
  quote TEXT,
  memory_number INTEGER,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.memory_strips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view memory strips"
  ON public.memory_strips FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert memory strips"
  ON public.memory_strips FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own memory strips"
  ON public.memory_strips FOR DELETE
  USING (auth.uid() = created_by);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.memory_strips;
