"use client";

import { SessionProvider } from "next-auth/react";
import SessionHydrator from "./auth/SessionHydrator";
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import { ToastProvider } from "@/components/ui/toast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <SessionProvider>
        <SessionHydrator />
        <Navbar />
        <main className="">{children}</main>
        <Footer />
      </SessionProvider>
    </ToastProvider>
  );
}
