import { FadeIn } from "@/components/animations/animation";

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <FadeIn>{children}</FadeIn>
    </section>
  );
}
