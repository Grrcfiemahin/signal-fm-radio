-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create messages table for listener requests/shoutouts
CREATE TABLE public.listener_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('request', 'shoutout', 'dedication')),
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on listener_messages
ALTER TABLE public.listener_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert messages
CREATE POLICY "Anyone can submit messages"
ON public.listener_messages
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Only admins can view messages
CREATE POLICY "Admins can view all messages"
ON public.listener_messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update messages
CREATE POLICY "Admins can update messages"
ON public.listener_messages
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete messages
CREATE POLICY "Admins can delete messages"
ON public.listener_messages
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Users can view their own role
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create index for better query performance
CREATE INDEX idx_listener_messages_status ON public.listener_messages(status);
CREATE INDEX idx_listener_messages_created_at ON public.listener_messages(created_at DESC);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);