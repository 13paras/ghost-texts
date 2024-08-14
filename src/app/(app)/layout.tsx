import Navbar from "@/app/_components/Navbar";
import { Suspense } from "react";
import Loader from "../_components/Loader";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <Suspense fallback={<Loader />}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </div>
    </Suspense>
  );
}
