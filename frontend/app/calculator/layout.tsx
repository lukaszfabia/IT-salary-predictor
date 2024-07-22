import { FadeIn } from "@/components/animations/animation";

export default function CalculatorLayout({
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
