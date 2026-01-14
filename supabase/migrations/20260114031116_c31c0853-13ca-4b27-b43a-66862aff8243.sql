-- Create a function to automatically create a 1-day free trial subscription for new users
CREATE OR REPLACE FUNCTION public.create_free_trial_subscription()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a free trial subscription (1 day) for the new user
  INSERT INTO public.subscriptions (
    user_id,
    plan_id,
    status,
    starts_at,
    expires_at
  )
  SELECT 
    NEW.id,
    sp.id,
    'active',
    now(),
    now() + interval '1 day'
  FROM public.subscription_plans sp
  WHERE sp.is_active = true
  ORDER BY sp.price_cents ASC
  LIMIT 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a trigger on auth.users to create free trial after user creation
-- We need to use the profiles table since we can't attach triggers to auth.users directly
-- The handle_new_user function already creates a profile, so we create the trial there

-- Drop existing function and recreate with trial creation included
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  plan_id_var uuid;
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Get the cheapest active plan for trial reference
  SELECT id INTO plan_id_var
  FROM public.subscription_plans
  WHERE is_active = true
  ORDER BY price_cents ASC
  LIMIT 1;
  
  -- Create 1-day free trial subscription if a plan exists
  IF plan_id_var IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_id,
      plan_id,
      status,
      starts_at,
      expires_at
    )
    VALUES (
      NEW.id,
      plan_id_var,
      'active',
      now(),
      now() + interval '1 day'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;