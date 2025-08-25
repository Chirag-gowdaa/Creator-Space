"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
function LayoutWithSession({ children }) {
  const pathname = usePathname();
  const decodedPath = decodeURIComponent(pathname);
  const { data: session, status } = useSession();

  if (status === "loading") return null; // Prevents early render errors

  const hideLayout = decodedPath.endsWith("/payment");
  const isDashboard = session && decodedPath.startsWith(`/${session.user.name}`);
  const isAuthCallback = decodedPath.startsWith("/api/auth");

  return (
    <>
      {!hideLayout && !isDashboard && !isAuthCallback && <Navbar session={session} />}
      <main className="flex-1">{children}</main>
      {!hideLayout && !isDashboard && !isAuthCallback && <Footer />}
    </>
  );
}


export default function Providers({ children }) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <LayoutWithSession>{children}
          <Toaster position="top-right" />
        </LayoutWithSession>
      </div>
    </SessionProvider>
  );
}
