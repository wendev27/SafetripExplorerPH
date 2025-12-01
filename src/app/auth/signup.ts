import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/db";
import { hash } from "bcryptjs";

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
    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hash(password, 10);

    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role
      createdAt: new Date(),
    });

    return res
      .status(201)
      .json({ message: "User created", userId: result.insertedId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
