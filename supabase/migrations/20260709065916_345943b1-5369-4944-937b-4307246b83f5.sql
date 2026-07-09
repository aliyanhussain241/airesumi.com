
DROP POLICY IF EXISTS "Admins view all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins delete posts" ON public.blog_posts;

CREATE POLICY "Admins view all posts" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert posts" ON public.blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update posts" ON public.blog_posts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete posts" ON public.blog_posts
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.blog_posts TO anon;
