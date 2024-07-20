import { FC, ReactNode } from "react"
import { solutionSteps } from "@/config/content"
import { aboutChapers } from "@/config/links"
import { Step } from "@/types"
import { faDownload, faLink, faBook } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Accordion, AccordionItem } from "@nextui-org/react"
import Link from "next/link"
import { title } from "../primitives"
import { api } from "@/config/api"
import { fetcher } from "@/lib/fetcher"

interface DownloadButtonProps {
    filename: string;
    children: ReactNode;
    text: string;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    variant: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
}

const DownloadButton: FC<DownloadButtonProps> = ({ filename, children, text, color, variant }) => {
    const endpoint: string = `${api}/download`;

    const handleDownload = async () => {
        console.log("Downloading file: ", filename);
        await fetcher(`${endpoint}/${filename}`, true).then((blob: Blob) => {
            const url: string = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch((error: Error) => {
            console.error(error);
            return;
        });

    }


    return (
        <Button
            color={color}
            variant={variant}
            radius="lg"
            className="flex items-center"
            onClick={handleDownload}
        >
            <span>{text}</span>
            {children}
        </Button>
    )
}

export const Solution: FC = () => {
    return (
        <>
            <h1 className={title()} id={aboutChapers[4].anchor}>{aboutChapers[4].chapter}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1 p-2">
                    <div className="flex flex-col justify-center items-center py-10">
                        <DownloadButton
                            color="secondary"
                            variant="light" filename={"objects"} text={"Download encoders and model"}                        >
                            <FontAwesomeIcon icon={faDownload} className="ml-2" />
                        </DownloadButton>
                        <Button className="my-10" color="success" variant="shadow" radius="lg">
                            <Link href="/statistics" className="flex items-center">
                                <span>Statistics</span>
                                <FontAwesomeIcon icon={faLink} className="ml-2" />
                            </Link>
                        </Button>
                        <DownloadButton color="primary" variant="ghost" filename={"report"} text={"Project report in polish"}>
                            <FontAwesomeIcon icon={faBook} className="ml-2" />
                        </DownloadButton>
                    </div>
                </div>
                <div className="md:flex-1 p-2 py-10">
                    <Accordion>
                        {solutionSteps.map((step: Step, index: number) => (
                            <AccordionItem key={`${index}`} aria-label={step.name} title={step.name} className="mb-1">{
                                step.desc
                            }</AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </>
    )
}