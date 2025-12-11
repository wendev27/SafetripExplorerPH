"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short"),
});

type LoginInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      const session = await getSession();

      if (session?.user?.userRole === "superadmin") {
        router.push("/features/dashboard/sadmin");
      } else if (session?.user?.userRole === "admin") {
        router.push("/features/dashboard/admin");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Welcome Back
        </h1>

        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        {/* Email */}
        <div className="mb-5">
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md"
        >
          Login
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
