import { ReactNode } from "react";
import Navbar from "./Navbar";
import Blob1 from "./Blob1";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-dark">
      <Navbar />
      {/* <Blob1 /> */}

      <main className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 -z-50">
        {children}
      </main>
    </div>
  );
}
