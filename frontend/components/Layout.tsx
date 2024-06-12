import { ReactNode } from "react";
import Navbar from "./Navbar";
import Blob1 from "./Blob1";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-dark">
      <Navbar />

      <main className="relative isolate px-6 pt-14 lg:px-8">
        <Blob1 />
        {children}
      </main>
    </div>
  );
}
