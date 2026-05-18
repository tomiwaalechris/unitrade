"use client";

import { useTransition } from "react";
import { createProduct } from "@/app/actions/product";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

export default function SellPage() {
  const [isPending, startTransition] = useTransition();

  async function action(formData: FormData) {
    startTransition(async () => {
      const result = await createProduct(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Listing created successfully");
      }
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-800">UniTrade</Link>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/catalog" className={buttonVariants({ variant: "ghost", className: "font-semibold text-slate-600 hover:text-slate-900" })}>
            Go to Catalog
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12">
         <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>
        <Card className="rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="space-y-2 pt-8 px-8 border-b border-slate-200 pb-6">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-800">List an Item</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Add details about the item you want to sell.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form action={action} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold text-slate-700">Title</Label>
                <Input id="title" name="title" placeholder="e.g. Intro to Psychology Textbook" required className="rounded-xl h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold text-slate-700">Description</Label>
                <Textarea id="description" name="description" placeholder="Describe the condition, contents, etc." required className="rounded-xl min-h-[120px] resize-none bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500 p-4" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="font-bold text-slate-700">Price (NGN)</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="0.00" required className="rounded-xl h-12 font-mono font-medium bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="font-bold text-slate-700">Image URL (Optional)</Label>
                <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://example.com/image.jpg" className="rounded-xl h-12 text-sm bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                <p className="text-xs font-semibold text-slate-400 mt-1">For this demo, provide a direct link to an image.</p>
              </div>
              
              <div className="pt-6 mt-6 border-t border-slate-200">
                <Button type="submit" className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide text-lg transition-colors" disabled={isPending}>
                  {isPending ? "Creating Listing..." : "Publish Listing"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
