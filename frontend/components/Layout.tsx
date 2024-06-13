import { ReactNode } from "react";
import Navbar from "./Navbar";
import Blob from "./Blob";
import Footer from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-dark flex flex-col min-h-screen">
      <Navbar />

      <main className="relative isolate px-6 lg:px-8 flex-grow">
        <Blob />
        {children}
      </main>

      <Footer />
    </div>
  );
}
