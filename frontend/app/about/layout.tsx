export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>{children}</div>
    </section>
  );
}

// <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
// <div className="inline-block max-w-lg text-center justify-center">
