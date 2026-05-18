import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { BookOpen, MapPin, Tag, ArrowLeft } from "lucide-react";
import BuyButton from "./buy-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, profiles(full_name, university)")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const isOwner = user?.id === product.seller_id;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-800">UniTrade</Link>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium">
           <Link href="/catalog" className={buttonVariants({ variant: "ghost", className: "font-semibold text-slate-600 hover:text-slate-900" })}>Back to Catalog</Link>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 lg:px-8 py-12">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
        
        <div className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-100 flex items-center justify-center relative">
            {product.images && product.images.length > 0 ? (
               // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <Tag className="h-16 w-16 text-slate-300" />
            )}
          </div>
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg w-fit mb-6 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {product.status === 'active' ? 'Available' : 'Sold'}
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-slate-800">{product.title}</h1>
            <p className="text-3xl font-mono font-bold text-green-600 mb-8">
              NGN {product.price.toLocaleString()}
            </p>
            
            <div className="prose prose-sm text-slate-600 mb-8 flex-1 font-medium">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Seller Information</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-12 h-12 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center font-bold text-indigo-500 text-lg">
                  {product.profiles.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{product.profiles.full_name}</p>
                  <p className="text-slate-500 font-medium inline-flex items-center gap-1 mt-1">
                     <MapPin className="h-3 w-3" />
                     {product.profiles.university}
                  </p>
                </div>
              </div>
            </div>
            
            {product.status === 'active' && (
              isOwner ? (
                <Button disabled className="w-full h-14 rounded-2xl text-lg font-bold bg-slate-200 text-slate-500">
                  This is your listing
                </Button>
              ) : (
                <div className="w-full">
                  <BuyButton productId={product.id} price={product.price} />
                </div>
              )
            )}
            {product.status !== 'active' && (
              <Button disabled className="w-full h-14 rounded-2xl text-lg font-bold bg-slate-200 text-slate-500">
                Item Sold
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
