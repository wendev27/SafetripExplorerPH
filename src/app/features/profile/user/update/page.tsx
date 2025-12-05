"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

// ----------------- SCHEMA -----------------
const accountSchema = z
  .object({
    name: z.string().min(2, "Name too short"),
    email: z.string().email("Invalid email"),

    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.newPassword || data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type AccountInputs = z.infer<typeof accountSchema>;

// ------------------------------------------

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);

  // FETCH USER INFO
  useEffect(() => {
    async function loadUser() {
      const res = await axios.get("/api/user/me");
      setUser(res.data);
    }
    loadUser();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountInputs>({
    resolver: zodResolver(accountSchema),
  });

  // Prefill user info
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  // ------------------ SUBMIT FORM ------------------
  const onSubmit = async (data: AccountInputs) => {
    try {
      const res = await axios.post("/api/user/account-update", data);
      alert(res.data.message || "Updated successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!user) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="py-20 bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-8 rounded shadow max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <label className="font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full border p-3 rounded mb-2"
            placeholder={user.name}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* EMAIL */}
          <label className="font-medium mt-4">Email</label>
          <input
            {...register("email")}
            className="w-full border p-3 rounded mb-2"
            placeholder={user.email}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          {/* ---- PASSWORD SECTION ---- */}
          <h3 className="text-lg font-semibold mt-6 mb-3">
            Change Password (optional)
          </h3>

          <input
            type="password"
            {...register("currentPassword")}
            className="w-full border p-3 rounded mb-2"
            placeholder="Current Password"
          />

          <input
            type="password"
            {...register("newPassword")}
            className="w-full border p-3 rounded mb-2"
            placeholder="New Password"
          />

          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full border p-3 rounded mb-2"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded mt-4 hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
