"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useApiToast } from "@/hooks/use-api-toast";

// ZOD VALIDATION
const signupSchema = z
  .object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password too short"),
    confirmPassword: z.string().min(6, "Password too short"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupInputs = z.infer<typeof signupSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { apiCall } = useApiToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInputs) => {
    const result = await apiCall(
      () =>
        axios.post("/api/auth/signup", {
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      {
        successMessage: "Account created successfully! Redirecting to login...",
        errorMessage: "Failed to create account. Please try again.",
        onSuccess: () => {
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create Account
        </h1>

        {/* NAME */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.name.message}
            </p>
          )}
        </div>

        {/* EMAIL */}
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

        {/* PASSWORD */}
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="absolute right-4 top-3.5 text-sm text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.password.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-6">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full p-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="absolute right-4 top-3.5 text-sm text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
          {formState.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-lg font-semibold transition-all shadow-md"
        >
          Register
        </button>

        {/* LINK TO LOGIN */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
