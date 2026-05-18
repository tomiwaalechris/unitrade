import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, MapPin, Tag } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const search = await searchParams;
  const categoryFilter = search.category ? (search.category as string).toLowerCase() : null;

  // Let's modify the query later to handle category filtering if we add a category column
  // For now, we'll fetch all active products
  const { data: products, error } = await supabase
    .from("products")
    .select("*, profiles(full_name, university)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Fallback mock data if DB is empty or fails
  const displayItems = products && products.length > 0 ? products : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-800">UniTrade</Link>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/sell" className={buttonVariants({ className: "rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" })}>
            Sell an Item
          </Link>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm sticky top-28">
              <h2 className="font-bold text-lg mb-4 text-slate-800">Filters</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Category</h3>
                  <div className="space-y-3">
                    {["All", "Textbooks", "Electronics", "Furniture", "Clothing"].map((cat) => (
                      <Link 
                        key={cat}
                        href={`/catalog${cat === 'All' ? '' : `?category=${cat.toLowerCase()}`}`}
                        className={`block text-sm transition-colors ${
                          (categoryFilter === cat.toLowerCase() || (cat === 'All' && !categoryFilter)) 
                            ? "font-bold text-indigo-600" 
                            : "font-medium text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="flex justify-between items-end mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
                  {categoryFilter ? <span className="capitalize">{categoryFilter}</span> : "All Items"}
                </h1>
                <span className="text-slate-500 text-sm font-medium">{displayItems.length} items found</span>
             </div>

             {displayItems.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Tag className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No items found</h3>
                  <p className="text-slate-500 mt-2 font-medium">Check back later or adjust your filters.</p>
                </div>
             ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayItems.map((item) => (
                    <Link href={`/product/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all hover:border-indigo-200">
                      <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <Tag className="h-12 w-12 text-slate-300" />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg leading-tight line-clamp-1 text-slate-800">{item.title}</h3>
                          <span className="font-mono font-bold whitespace-nowrap ml-4 text-green-600">
                            NGN {item.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 mt-auto pt-4 flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider rounded-lg border border-slate-100">
                            <MapPin className="h-3 w-3" />
                            {item.profiles?.university || "Unknown University"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}
