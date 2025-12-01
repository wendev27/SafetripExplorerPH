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
        _id: session.user.id,
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        role: session.user.userRole ?? "user", // fallback
      });
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  return null;
}
