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
    <div className="p-12  flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full p-3 mb-4 border rounded"
        />
        {formState.errors.email && (
          <p className="text-red-500">{formState.errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full p-3 mb-4 border rounded"
        />
        {formState.errors.password && (
          <p className="text-red-500">{formState.errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Wanna register?{" "}
          <Link href="/auth/register" className="text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>

        {/* ---------- TEST ACCOUNTS SECTION ---------- */}
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <h2 className="font-semibold mb-2 text-center">Test Accounts</h2>

          <div className="mb-3">
            <p className="font-medium">User</p>
            <p>Email: w@w.com</p>
            <p>Password: wendell</p>
          </div>

          <div className="mb-3">
            <p className="font-medium">Admin</p>
            <p>Email: tryvercel@tryvercel.com</p>
            <p>Password: tryvercel</p>
          </div>

          <div>
            <p className="font-medium">Super Admin</p>
            <p>Email: sadmin@s.com</p>
            <p>Password: sadmin</p>
          </div>
        </div>
        {/* ----------------------------------------- */}
      </form>
    </div>
  );
}
