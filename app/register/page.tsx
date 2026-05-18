"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { register } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { BookOpen } from "lucide-react";

const SUPPORTED_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Zenith Bank", code: "057" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "United Bank for Africa", code: "033" },
];

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      fullName: "", email: "", password: "", university: "", bankCode: "", accountNumber: "" 
    },
  });

  function onSubmit(data: RegisterInput) {
    startTransition(async () => {
      const result = await register(data);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Account created successfully!");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-900 p-4 py-12">
      <div className="w-full max-w-xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <BookOpen className="h-7 w-7" />
            </div>
            <span className="font-bold text-3xl tracking-tight text-slate-800">UniTrade</span>
          </Link>
        </div>
        <Card className="rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="space-y-2 text-center pt-8 px-8">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-800">Join the Marketplace</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Create an account securely linked to your university to start trading.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Account Details */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Account Info</h3>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold text-slate-700">Full Name</Label>
                    <Input id="fullName" placeholder="John Doe" {...form.register("fullName")} className="rounded-xl h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                    {form.formState.errors.fullName && <p className="text-xs text-red-500 font-medium">{form.formState.errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university" className="font-bold text-slate-700">University Name</Label>
                    <Input id="university" placeholder="e.g. University of Lagos" {...form.register("university")} className="rounded-xl h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                    {form.formState.errors.university && <p className="text-xs text-red-500 font-medium">{form.formState.errors.university.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-slate-700">University Email</Label>
                    <Input id="email" type="email" placeholder="student@edu.com" {...form.register("email")} className="rounded-xl h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                    {form.formState.errors.email && <p className="text-xs text-red-500 font-medium">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                    <Input id="password" type="password" {...form.register("password")} className="rounded-xl h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                    {form.formState.errors.password && <p className="text-xs text-red-500 font-medium">{form.formState.errors.password.message}</p>}
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Payout Details (Paystack)</h3>
                  <p className="text-xs text-slate-500 font-medium mb-2">We need this to pay you when you sell an item.</p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bank" className="font-bold text-slate-700">Settlement Bank</Label>
                    <Select onValueChange={(val: string | null) => val && form.setValue("bankCode", val)}>
                      <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_BANKS.map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>{bank.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.bankCode && <p className="text-xs text-red-500 font-medium">{form.formState.errors.bankCode.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="font-bold text-slate-700">Account Number</Label>
                    <Input id="accountNumber" placeholder="0123456789" maxLength={10} {...form.register("accountNumber")} className="rounded-xl h-11 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500" />
                    {form.formState.errors.accountNumber && <p className="text-xs text-red-500 font-medium">{form.formState.errors.accountNumber.message}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 mt-6">
                <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm" disabled={isPending}>
                  {isPending ? "Creating account..." : "Join Platform"}
                </Button>
              </div>
            </form>
            <div className="mt-6 text-center text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
