// src/components/common/Navbar/Navbar.tsx
import { useAuthStore } from "@/hooks/useAuthStore";
import NavbarAnonymous from "./NavbarAnon";
import NavbarAdmin from "./NavbarAdmin";
import NavbarUser from "./NavbarUser";
import NavbarSuperAdmin from "./NavbarSAdmin";

export default function Navbar() {
  //   const { user } = useAuthStore(); // Zustand auth store

  //   if (!user) return <NavbarAnonymous />;
  //   if (user.role === "user") return <NavbarUser />;
  //   if (user.role === "admin") return <NavbarAdmin />;
  //   if (user.role === "superadmin") return <NavbarSuperAdmin />;

  return <NavbarAnonymous />;
}
