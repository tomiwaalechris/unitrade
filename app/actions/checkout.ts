"use server";

import { createClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";
import { redirect } from "next/navigation";

export async function createCheckoutSession(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/product/" + productId);
  }

  // Fetch product and seller subaccount info
  const { data: product, error } = await supabase
    .from("products")
    .select("*, profiles(paystack_subaccount_id, email, full_name)")
    .eq("id", productId)
    .single();

  if (error || !product) {
    return { error: "Product not found" };
  }

  if (product.seller_id === user.id) {
    return { error: "You cannot buy your own product" };
  }

  // Create an order record in our database
  // Actually, we must save the paystack reference. So we'll generate one
  const reference = `ORD-${Date.now()}-${productId.slice(0, 5)}`;
  // Convert price to Kobo
  const amountInKobo = Math.round(product.price * 100);

  const { error: orderError } = await supabase.from("orders").insert({
    product_id: productId,
    buyer_id: user.id,
    amount: product.price,
    paystack_reference: reference,
    status: "pending",
  });

  if (orderError) {
    console.error(orderError);
    return { error: "Failed to create order. Please try again." };
  }

  // User's email (the buyer!)
  const buyerEmail = user.email!;

  // Initialize Paystack
  let checkoutUrl;
  try {
    const paystackSession = await initializeTransaction({
      email: buyerEmail,
      amount: amountInKobo,
      reference,
      subaccount: product.profiles.paystack_subaccount_id, // Routes 90% to vendor, 10% to platform
      callback_url: `${process.env.APP_URL}/api/paystack/callback`,
    });
    checkoutUrl = paystackSession.authorization_url;
  } catch (err: any) {
    return { error: err.message || "Failed to initialize payment gateway." };
  }

  redirect(checkoutUrl);
}
