DROP POLICY IF EXISTS "Any signed-in user can update shared state" ON public.shared_state;
CREATE POLICY "Any signed-in user can update shared state"
  ON public.shared_state FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() = updated_by);