import Link from "next/link";
import { Button } from "@nextui-org/button";
import { faArrowRight, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { title, subtitle } from "@/components/primitives";
import { FadeIn } from "@/components/animations/animation";

export default function Home() {
  return (
    <FadeIn>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Discover your potential&nbsp;</h1>
          <h1 className={title({ color: "violet" })}>earnings</h1>
          <h1 className={title()}>&nbsp;in IT&nbsp;</h1>
          <h1 className={title()}>- based on various&nbsp;</h1>
          <h1 className={title({ color: "yellow" })}>factors</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Predict salary based on your known{" "}
            <span className="font-semibold">languages</span>,{" "}
            <span className="font-semibold">frameworks</span>, and other factors.
          </h2>
        </div>

        <div className="flex gap-5">
          <Link href="/calculator">
            <Button color="secondary" radius="full" size="md" variant="ghost">
              <FontAwesomeIcon className="w-5 h-5" icon={faMoneyBill} />
              &nbsp;Compute salary
            </Button>
          </Link>
          <Link href="/about">
            <Button color="primary" radius="full" size="md" variant="shadow">
              <FontAwesomeIcon className="w-5 h-5" icon={faArrowRight} />
              &nbsp;Read more
            </Button>
          </Link>
        </div>
      </section>
    </FadeIn>
  );
}
