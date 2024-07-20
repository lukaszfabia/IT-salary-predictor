import { FC } from "react"
import { aboutChapers } from "@/config/links"
import { title } from "../primitives"
import Image from "next/image";
import worker from "../../assets/worker.svg"


export const Motivations: FC = () => {
    return (
        <>
            <h1 className={title()} id={aboutChapers[1].anchor}>{aboutChapers[1].chapter}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1 p-2">
                    <div className="flex justify-center items-center">
                        <Image src={worker} alt="worker" width={200} height={200} />
                    </div>
                </div>
                <div className="md:flex-1 p-2 py-10">
                    <p className="md:text-lg text-md indent-6">
                        Purpose of this project is data analysis, which can proof hard situation in IT or show most important skills to earn more than average. For me and other people who are interested in programming and plan thier future in IT, it can be very useful tool.
                    </p>
                </div>
            </div>
        </>
    )
}
