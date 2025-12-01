"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function SessionHydrator() {
  const { data: session } = useSession();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (session?.user) {
      setUser({
        _id: session.user.id, // string, always defined
        name: session.user.name ?? "", // fallback if null
        email: session.user.email ?? "", // fallback if null
        role: session.user.role, // "user" | "admin" | "superadmin"
      });
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  return null;
}
