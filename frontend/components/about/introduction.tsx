import { FC } from "react";
import Image from "next/image";
import { aboutChapers } from "@/config/links";
import { Technology } from "@/types";
import { Chip } from "@nextui-org/chip";
import { title } from "../primitives";

import mongo from "../../assets/techs/mongo.svg"
import python from "../../assets/techs/python.svg"
import jupyter from "../../assets/techs/jupyter.svg"
import matplotlib from "../../assets/techs/matplotlib.svg"
import pandas from "../../assets/techs/pandas.svg"
import selenium from "../../assets/techs/selenium.svg"
import sklearn from "../../assets/techs/sklearn.svg"
import numpy from "../../assets/techs/numpy.svg"


const techs: Technology[] = [
    { name: "MongoDB", svg: <Image src={mongo} alt="mongo" width={20} height={20} /> },
    { name: "Python", svg: <Image src={python} alt="python" width={20} height={20} /> },
    { name: "Jupyter", svg: <Image src={jupyter} alt="jupyter" width={20} height={20} /> },
    { name: "Matplotlib", svg: <Image src={matplotlib} alt="matplotlib" width={20} height={20} /> },
    { name: "Pandas", svg: <Image src={pandas} alt="pandas" width={20} height={20} /> },
    { name: "scikit-learn", svg: <Image src={sklearn} alt="sklearn" width={20} height={20} /> },
    { name: "Selenium", svg: <Image src={selenium} alt="selenium" width={20} height={20} /> },
    { name: "Numpy", svg: <Image src={numpy} alt="numpy" width={20} height={20} /> },
]

export const Introduction: FC = () => {
    return (
        <>
            <h1 className={title()} id={aboutChapers[0].anchor}>{aboutChapers[0].chapter}</h1>
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1 p-2 py-10">
                    <p className="md:text-lg text-md indent-6">
                        To create a model which will predict salary we need to collect data, preprocess it, find features and value to predict and then choose best model. In this short description, I'll try to show my way of thinking.
                    </p>
                </div>
                <div className="md:flex-1 p-2">
                    <h1 className="text-3xl">Used tools</h1>
                    <div className="flex flex-wrap items-center justify-center lg:py-0 py-4">
                        {techs.map((elem: Technology, index: number) => (
                            <Chip
                                key={index}
                                color="default"
                                variant="bordered"
                                className="flex items-center m-2 transition-all ease-in-out duration-200 hover:border-default-500 hover:cursor-pointer"
                            >
                                <span className="flex items-center">
                                    {elem.svg}
                                    <span className="p-1">{elem.name}</span>
                                </span>
                            </Chip>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}