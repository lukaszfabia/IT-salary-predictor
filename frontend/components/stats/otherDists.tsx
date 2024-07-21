// here are pie charts
"use client";
import React from "react";
import { FC } from "react";
import { PlotterProps, Statistic } from "@/types";
import { getRandomColorsForPie } from "@/lib/randomColor";
import { Plotter } from "./plotter";
import { statsChapers } from "@/config/links";
import { title } from "../primitives";

function getDataForPie(setChartData: any, data?: Statistic[]): void {
    if (data) {
        const labels: string[] = data.map((item: Statistic) => item.name);
        const values: number[] = data.map((item: Statistic) => item.multiplicity);
        const colors: string[] = labels.map(() => getRandomColorsForPie());

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Amount of given kategory",
                    data: values,
                    backgroundColor: colors,
                    borderColor: colors.map((color) => color.replace("0.2", "1")),
                    borderWidth: 1,
                },
            ],
        });
    }
}


const propsExp: PlotterProps<Statistic> = {
    kategory: "exp",
    title: "Most popular experience level",
    type: "pie",
    getData: (setChartData: any, data?: Statistic[]): void => getDataForPie(setChartData, data)
}

const propsMode: PlotterProps<Statistic> = {
    kategory: "modes",
    title: "Most popular working modes",
    type: "pie",
    getData: (setChartData: any, data?: Statistic[]): void => getDataForPie(setChartData, data)
}

const ExperienceDist: FC = () => {
    return (
        <div className="w-1/2">
            <Plotter props={propsExp} />
        </div>
    )
}

const OperatingModeDist: FC = () => {
    return (
        <div className="w-1/2">
            <Plotter props={propsMode} />
        </div>
    )
}


export const WorkInIt = () => {
    const myRegrets: any = [
        { subheader: "Juniors", desc: "There we can see very important information that there are few offers for juniors. What can complicate their situation and also it confirms that currently getting a job can be challenge." },
        { subheader: "Mids/Seniors", desc: "Mids also known as regulars are in pretty good situation right now. They rather they will find a job cause there are around 40% of all offers like seniors." },
        { subheader: "Work modes", desc: "It can be really interesting because most offers are for remote work but it comes from that most offers are for quite advanced programmers." }
    ]


    return (
        <>
            <h1 className={title()} id={statsChapers[1].anchor}>
                {statsChapers[1].chapter}
            </h1>
            <div className="flex flex-col md:flex-row mt-10">
                <div className="md:flex-1 p-2 py-10">
                    <div className="flex flex-wrap items-center justify-center lg:py-0 py-4">
                        <ExperienceDist />
                        <OperatingModeDist />
                    </div>
                </div>
                <div className="md:flex-1 p-2 py-10">
                    {myRegrets.map((elem: any, index: number) => (
                        <React.Fragment key={index} >
                            <div className={index % 2 === 1 ? "my-5" : ""}>
                                <h1 className="text-3xl font-semibold">{elem.subheader}</h1>
                                <p className="md:flex-1 p-2 indent-6">{elem.desc}</p>
                            </div>
                        </React.Fragment>
                    ))}

                </div>
            </div>
        </>
    );
}