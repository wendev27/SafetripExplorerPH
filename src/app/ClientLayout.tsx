"use client";

import { SessionProvider } from "next-auth/react";
import SessionHydrator from "./auth/SessionHydrator";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionHydrator />
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </SessionProvider>
  );
}
