import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/services/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      userRole: role || "user",
    });

    return res
      .status(201)
      .json({ message: "User created", userId: newUser._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
