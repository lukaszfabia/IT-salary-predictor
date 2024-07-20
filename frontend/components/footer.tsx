import { FC } from "react";
import { Link } from "@nextui-org/link";

export const Footer: FC = () => {
  return (
    <footer className="w-full flex items-center justify-center py-10">
      <p className="flex items-center gap-1 text-current mx-0.5 text-default-500">
        <span>
          Powered by{" "}
          <Link
            isExternal
            className="text-default-700 dark:text-default-600"
            href="https://justjoin.it"
          >
            justjoin.it.
          </Link>
        </span>
        <span>
          Created by{" "}
          <Link
            isExternal
            className="text-default-700 dark:text-default-600"
            href="https://lukaszfabia.vercel.app"
          >
            Lukasz Fabia
          </Link>
        </span>
      </p>
    </footer>
  );
};
