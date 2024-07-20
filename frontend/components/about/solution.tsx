import { FC, ReactNode } from "react";
import { faDownload, faLink, faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";

import { Step } from "@/types";
import { aboutChapers } from "@/config/links";
import { solutionSteps } from "@/config/content";
import { api } from "@/config/api";
import { fetcher } from "@/lib/fetcher";

import { title } from "../primitives";

interface DownloadButtonProps {
  filename: string;
  children: ReactNode;
  text: string;
  color:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  variant:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost"
    | undefined;
}

const DownloadButton: FC<DownloadButtonProps> = ({
  filename,
  children,
  text,
  color,
  variant,
}) => {
  const endpoint: string = `${api}/download`;

  const handleDownload = async () => {
    await fetcher(`${endpoint}/${filename}`, true)
      .then((blob: Blob) => {
        const url: string = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error: Error) => {
        return;
      });
  };

  return (
    <Button
      className="flex items-center"
      color={color}
      radius="lg"
      variant={variant}
      onClick={handleDownload}
    >
      <span>{text}</span>
      {children}
    </Button>
  );
};

export const Solution: FC = () => {
  return (
    <>
      <h1 className={title()} id={aboutChapers[4].anchor}>
        {aboutChapers[4].chapter}
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:flex-1 p-2">
          <div className="flex flex-col justify-center items-center py-10">
            <DownloadButton
              color="secondary"
              filename={"objects"}
              text={"Download encoders and model"}
              variant="light"
            >
              <FontAwesomeIcon className="ml-2" icon={faDownload} />
            </DownloadButton>
            <Button
              className="my-10"
              color="success"
              radius="lg"
              variant="shadow"
            >
              <Link className="flex items-center" href="/statistics">
                <span>Statistics</span>
                <FontAwesomeIcon className="ml-2" icon={faLink} />
              </Link>
            </Button>
            <DownloadButton
              color="primary"
              filename={"report"}
              text={"Project report in polish"}
              variant="ghost"
            >
              <FontAwesomeIcon className="ml-2" icon={faBook} />
            </DownloadButton>
          </div>
        </div>
        <div className="md:flex-1 p-2 py-10">
          <Accordion>
            {solutionSteps.map((step: Step, index: number) => (
              <AccordionItem
                key={`${index}`}
                aria-label={step.name}
                className="mb-1"
                title={step.name}
              >
                {step.desc}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};
