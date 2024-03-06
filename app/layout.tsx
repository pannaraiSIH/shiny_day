import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navigation/Navbar";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/components/SessionProvider";
import { getServerSession } from "next-auth";

import AlertBox from "@/components/AlertBox";
import { authOptions } from "@/lib/nextauth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shiny Day",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={`${inter.className} h-screen flex flex-col`}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
          <Footer />
          <AlertBox />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
