import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BookOpen, Laptop, Sofa, Shirt, Package, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Header */}
      <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800">UniTrade</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/catalog" className="text-slate-600 hover:text-slate-900 transition-colors">Catalog</Link>
          <div className="flex items-center gap-4 ml-2">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
            <Link href="/register" className={buttonVariants({ className: "rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" })}>
              Join Platform
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-5">
        
        {/* Box 1 (Hero - 2x2) */}
        <div className="col-span-1 md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <span>Verified University Students Only</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-4 text-slate-800">
              The Campus<br/>
              <span className="text-indigo-600">Marketplace.</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-md font-medium mt-6">
              Buy, sell, and trade textbooks, electronics, and dorm essentials securely with verified students at your university.
            </p>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto">
            <Link href="/sell" className={buttonVariants({ className: "px-6 py-6 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 text-lg" })}>
              Start Selling
            </Link>
            <Link href="/catalog" className={buttonVariants({ variant: "outline", className: "px-6 py-6 bg-white text-indigo-600 border-2 border-indigo-100 rounded-2xl font-bold hover:bg-indigo-50 text-lg" })}>
               Browse Items
            </Link>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-50 rounded-full opacity-50 z-0"></div>
        </div>

        {/* Box 2 (Verification - 1x1) */}
        <div className="col-span-1 md:col-span-1 md:row-span-1 bg-indigo-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-indigo-800/50 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-indigo-300" />
            </div>
            <span className="text-indigo-300 text-xs font-mono uppercase">Identity Check</span>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold">.edu Verification</h3>
            <p className="text-indigo-200 text-sm mt-1">Every user must provide their university details to join the platform.</p>
          </div>
        </div>

        {/* Box 3 (Categories List - 1x2) */}
        <div className="col-span-1 md:col-span-1 md:row-span-2 bg-white rounded-3xl p-6 border-2 border-slate-200 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Popular Categories</h3>
          <div className="space-y-6">
            {[
              { name: "Textbooks", icon: BookOpen },
              { name: "Electronics", icon: Laptop },
              { name: "Furniture", icon: Sofa },
              { name: "Clothing", icon: Shirt },
              { name: "Other Items", icon: Package },
            ].map((cat) => (
              <Link 
                key={cat.name} 
                href={`/catalog?category=${cat.name.toLowerCase()}`}
                className="group flex items-center gap-4 text-sm font-medium"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-slate-800 group-hover:text-indigo-700 transition-colors">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Box 4 (Stats/Local - 1x1) */}
        <div className="col-span-1 md:col-span-1 md:row-span-1 bg-white rounded-3xl p-6 border-2 border-slate-200 flex flex-col justify-center items-center text-center">
          <div className="text-3xl font-black text-slate-800">Local</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Local Pickups</div>
          <p className="text-slate-500 text-sm mt-4 font-medium px-2">Trade on campus without the hassle of shipping.</p>
        </div>

        {/* Box 5 (Secure Payments - 1x1) */}
        <div className="col-span-1 md:col-span-1 md:row-span-1 bg-white rounded-3xl p-6 border-2 border-slate-200 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-3 text-orange-600">
            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
            <span className="text-xs font-bold uppercase tracking-wider">Escrow Guard</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 mt-2">Secure Payments</h4>
            <p className="text-slate-500 text-xs mt-1 font-medium">Paystack ensures sellers get exactly what they earn, securely.</p>
          </div>
        </div>

        {/* Box 6 (Featured / Value Prop - 2x1) */}
        <div className="col-span-1 md:col-span-2 md:row-span-1 bg-slate-800 rounded-3xl p-8 text-white flex items-center gap-8 relative overflow-hidden">
          <div className="flex-1 z-10 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2">A smarter way to exchange</h3>
            <p className="text-slate-400 text-sm">Join thousands trading goods securely on campus.</p>
          </div>
          
          <div className="hidden sm:block bg-white/10 p-4 rounded-2xl w-48 border border-white/20 z-10 backdrop-blur-sm shrink-0">
             <div className="space-y-3">
               <div className="h-3 bg-white/20 rounded w-1/3"></div>
               <div className="h-12 bg-white/10 rounded border border-dashed border-white/20"></div>
               <div className="h-8 bg-indigo-500 rounded-lg w-full flex items-center justify-center text-white text-xs font-bold">Secure Purchase</div>
             </div>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/20 to-transparent"></div>
        </div>

        {/* Box 7 (Green Card - 1x1) */}
        <div className="col-span-1 md:col-span-1 md:row-span-1 bg-green-500 rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-xl">
            $
          </div>
          <div>
            <h4 className="text-xl font-bold">Earn Cash</h4>
            <p className="text-green-100 text-sm font-medium mt-1">Keep exactly what you earn with minimal platform fees.</p>
          </div>
        </div>

      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm font-medium text-slate-400 bg-white shrink-0 mt-auto">
        <p>© {new Date().getFullYear()} UniTrade Marketplace. Built for students.</p>
      </footer>
    </div>
  );
}
