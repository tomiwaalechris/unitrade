"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(input: LoginInput) {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return { error: "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/catalog");
}

export async function register(input: RegisterInput) {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { email, password, fullName, university, bankCode, accountNumber } = result.data;

  // 1. Create Paystack Subaccount (Server-side)
  let subaccountId = null;
  try {
    const paystackRes = await fetch("https://api.paystack.co/subaccount", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: `${fullName} - ${university}`,
        settlement_bank: bankCode,
        account_number: accountNumber,
        percentage_charge: 10, // 10% platform commission
        description: `Vendor subaccount for ${fullName}`,
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackData.status) {
      return { error: `Bank Verification Failed: ${paystackData.message}` };
    }
    subaccountId = paystackData.data.subaccount_code;
  } catch (error) {
    console.error("Paystack error", error);
    return { error: "Failed to verify bank details with Paystack." };
  }

  // 2. Register user in Supabase Auth
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Failed to create account" };
  }

  // 3. Insert into profiles table
  // Using the service role bypasses RLS and allows backend inserts, but since user is logged in, normal insert works.
  // Actually, wait, auth.signUp logs the user in if email confirmation isn't required by default.
  // We'll insert it right away.
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    full_name: fullName,
    university: university,
    paystack_subaccount_id: subaccountId,
  });

  if (profileError) {
    console.error(profileError);
    return { error: "Account created, but failed to link profile. Please contact support." };
  }

  revalidatePath("/", "layout");
  redirect("/catalog");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
