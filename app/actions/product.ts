"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  const input = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  };

  const result = productSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { title, description, price, imageUrl } = result.data;
  const images = imageUrl ? [imageUrl] : [];

  const { error } = await supabase.from("products").insert({
    seller_id: user.id,
    title,
    description,
    price,
    images: images,
    status: "active",
  });

  if (error) {
    console.error(error);
    return { error: "Failed to create listing" };
  }

  revalidatePath("/catalog");
  redirect("/catalog");
}
