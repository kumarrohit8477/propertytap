import { create_client } from '@/lib/supabase/client';

export async function sign_up_user(payload: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}) {
  const supabase = create_client();
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.full_name,
        phone: payload.phone || null,
        role: 'user',
      },
    },
  });

  if (!error && data?.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone || null,
        role: 'user',
      });
    } catch {
      // Ignore if trigger already created it
    }
  }

  return { data, error };
}

export async function sign_in_user(payload: {
  email: string;
  password: string;
}) {
  const supabase = create_client();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  return { data, error };
}

export async function sign_out_user() {
  const supabase = create_client();
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function reset_password_request(email: string) {
  const supabase = create_client();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset_password`,
  });
  return { data, error };
}

export async function update_user_password(password: string) {
  const supabase = create_client();
  const { data, error } = await supabase.auth.updateUser({ password });
  return { data, error };
}
