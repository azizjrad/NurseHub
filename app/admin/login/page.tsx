"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import toast from "react-hot-toast";
import { SettingsProvider } from "@/lib/settings-context";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsProvider>
      <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl gradient-warm mb-4">
              <i className="fas fa-heartbeat text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl font-serif mb-2">Admin Login</h1>
            <p className="text-text-secondary">Access the NurseHub dashboard</p>
          </div>

          <div className="bg-bg-card rounded-3xl p-8 shadow-lg border border-border-color">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-text-primary">
                  <i className="fas fa-user text-accent-primary mr-2"></i>
                  Username
                </label>
                <input
                  {...register("username")}
                  type="text"
                  className="w-full px-4 py-3 border-2 border-border-color rounded-xl bg-bg-primary focus:outline-none focus:border-accent-primary transition-colors"
                  placeholder="eyachoukk"
                />
                {errors.username && (
                  <p className="text-danger text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 font-semibold text-text-primary">
                  <i className="fas fa-lock text-accent-primary mr-2"></i>
                  Password
                </label>
                <input
                  {...register("password")}
                  type="password"
                  className="w-full px-4 py-3 border-2 border-border-color rounded-xl bg-bg-primary focus:outline-none focus:border-accent-primary transition-colors"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-danger text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 gradient-warm text-white rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-text-secondary hover:text-accent-primary transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back to Home
            </a>
          </div>
        </div>
        <AccessibilityToolbar />
      </div>
    </SettingsProvider>
  );
}
