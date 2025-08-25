"use client";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
function LayoutWithSession({ children }) {
  const pathname = usePathname();
  const decodedPath = decodeURIComponent(pathname);
  const { data: session } = useSession();

  // Hide Navbar/Footer for payment pages
  const hideLayout = decodedPath.endsWith("/payment");

  // Hide Navbar/Footer for dashboard pages
  const isDashboard = session && decodedPath.startsWith(`/${session.user.name}`);

  return (
    <>
      {!hideLayout && !isDashboard && <Navbar session={session} />}
      <main className="flex-1">{children}</main>
      {!hideLayout && !isDashboard && <Footer />}
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
