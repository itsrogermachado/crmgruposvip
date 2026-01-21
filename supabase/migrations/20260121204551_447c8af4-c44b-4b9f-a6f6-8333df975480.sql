CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  
  -- Create 7-day free trial subscription if a plan exists
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
      now() + interval '7 days'
    );
  END IF;
  
  RETURN NEW;
END;
$function$;