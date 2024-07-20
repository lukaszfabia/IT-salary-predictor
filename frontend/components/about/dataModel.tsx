import { handlingFeatures } from "@/config/content"
import { aboutChapers } from "@/config/links"
import { title } from "../primitives"
import { FC } from "react"
import ExampleData from "./table"

export const DataModel: FC = () => {
    return (
        <>
            <h1 className={title()} id={aboutChapers[3].anchor}>{aboutChapers[3].chapter}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1 p-2 md:py-10 py-4">
                    <p className="md:text-lg text-md indent-6">
                        Main features are in the picture. Here is my handling of various features in the dataset:
                    </p>
                </div>
                <div className="md:flex-1 p-2 md:py-10 md:px-0 px-10">
                    <ul className="list-outside list-disc py-2 md:px-0 px-4">
                        {handlingFeatures.map((elem: any, index: number) => (
                            <li key={index}><b>{elem.name}</b>: {elem.desc}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <ExampleData amount={3} />
        </>
    )
}
