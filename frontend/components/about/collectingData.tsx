import { FC } from "react"
import { aboutChapers, encoders } from "@/config/links"
import { steps } from "@/config/content"
import Link from "next/link"
import { title } from "../primitives"

export const CollectingData: FC = () => {
    return (
        <>
            <h1 className={title()} id={aboutChapers[2].anchor}>{aboutChapers[2].chapter}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1 p-2 py-10">
                    <p className="md:text-lg text-md indent-6">
                        The IT offers comes from <Link target="_blank" href={"https://justjoin.it"} className="transition-all ease-in-out duration-200 text-blue-500 hover:text-blue-400">justjoin.it.</Link> I was getting them from 21-23.05.2024. Currently there are about 5000 offers in database from Poland. Unfortunately, I had to reject internship offers because there were few of them and I did not consider offers without a range.
                    </p>
                    <p className="md:text-lg text-md py-6 indent-6">
                        After collecting data I had to preprocess it. The most important thing was to encode categorical data and encode technologies in offer. It gave me only numbers in dataset and I could use it in model. To encode it, I used <Link target="_blank" href={encoders.multilabel.link} className="transition-all ease-in-out duration-200 text-blue-500 hover:text-blue-400">{encoders.multilabel.name}</Link> and <Link target="_blank" href={encoders.labelencoder.link} className="transition-all ease-in-out duration-200 text-blue-500 hover:text-blue-400">{encoders.labelencoder.name}</Link> from sklearn library.
                    </p>
                </div>
                <div className="md:flex-1 p-2">
                    <div className="flex flex-wrap items-center justify-center lg:py-0 py-4">
                        <ol className="relative border-s border-gray-200 dark:border-gray-700">
                            {steps.map((step: any, index: number) => (
                                <li className="mb-10 ms-4" key={index}>
                                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.name}</h3>
                                    <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-400">{step.desc}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </>
    )
}