"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: LoginInput) {
    startTransition(async () => {
      const result = await login(data);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans text-slate-900 p-4">
      <div className="w-full max-w-md">
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
            <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  {...form.register("email")}
                  className="rounded-xl h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-slate-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  className="rounded-xl h-12 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500 font-medium">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
