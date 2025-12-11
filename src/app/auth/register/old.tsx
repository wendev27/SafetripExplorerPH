"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInputs) => {
    try {
      await axios.post("/api/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full p-3 mb-4 border rounded"
        />
        {formState.errors.name && (
          <p className="text-red-500">{formState.errors.name.message}</p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full p-3 mb-4 border rounded"
        />
        {formState.errors.email && (
          <p className="text-red-500">{formState.errors.email.message}</p>
        )}

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
            className="w-full p-3 border rounded"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-sm text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {formState.errors.password && (
          <p className="text-red-500">{formState.errors.password.message}</p>
        )}

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword")}
            className="w-full p-3 border rounded"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-sm text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        {formState.errors.confirmPassword && (
          <p className="text-red-500">
            {formState.errors.confirmPassword.message}
          </p>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>

        {/* LINK TO LOGIN */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
