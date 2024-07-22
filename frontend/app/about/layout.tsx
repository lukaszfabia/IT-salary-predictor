import { FadeIn } from "@/components/animations/animation";

export default function AboutLayout({
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

