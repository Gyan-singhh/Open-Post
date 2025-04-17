import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/providers/SessionProvider";
import SessionCheck from "@/components/SessionCheck";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenPost",
  description: "Create, share, and explore posts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SessionCheck>
            <ReactQueryProvider>
              <Navbar />
              <main className="min-h-[82vh] sm:min-h-[75vh]">
                {children}
              </main>
              <Footer />
            </ReactQueryProvider>
          </SessionCheck>
        </AuthProvider>
      </body>
    </html>
  );
}