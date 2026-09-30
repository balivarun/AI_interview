"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/lib/validations";

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async () => {
    router.push("/dashboard");
  };

  return (
    <AuthCard title="Create Account" subtitle="Set up your mock interview profile.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-slate-300">Name</label>
          <Input id="name" placeholder="Varun Bali" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-slate-300">Email</label>
          <Input id="email" type="email" placeholder="name@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-slate-300">Password</label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm text-slate-300">Confirm Password</label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </Button>
      </form>
    </AuthCard>
  );
}
