import AuthProvider from "@/context/AuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GhostTexts",
  description: "Anonymous message app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster richColors />
        </body>
      </AuthProvider>
    </html>
  );
}
