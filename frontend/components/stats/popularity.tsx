import { FC } from "react";
import { PlotterProps, Statistic } from "@/types";
import { Plotter } from "./plotter";
import { statsChapers } from "@/config/links";
import { title } from "../primitives";

function getDataForPopularity(setChartData: any, data?: Statistic[], label?: string): void {
    if (data) {
        const labels: string[] = data.map((item: Statistic) => item.name);
        const multiplicity: number[] = data.map((item: Statistic) => item.multiplicity);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: label,
                    data: multiplicity,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }
}

const technologiesPopularity: PlotterProps<Statistic> = {
    kategory: "technologies",
    title: "Popular technologies",
    type: "bar",
    getData: (setChartData: any, data?: Statistic[] | undefined, label?: string) => getDataForPopularity(setChartData, data, label = "amount")
}

const cityPopularity: PlotterProps<Statistic> = {
    kategory: "locations",
    title: "Popular cities in offers",
    type: "bar",
    getData: (setChartData: any, data?: Statistic[] | undefined, label?: string) => getDataForPopularity(setChartData, data, "amount")
}

const PopularityDiagram: FC<{ props: PlotterProps<Statistic> }> = ({ props }) => {
    return (
        <Plotter props={props} />
    )
}


export const Popularity: FC = () => {
    return (
        <>
            <h1 className={title()} id={statsChapers[2].anchor}>
                {statsChapers[2].chapter}
            </h1>
            <div className="flex flex-wrap md:flex-row mt-10">
                <div className="md:flex-1 p-2 py-10">
                    <div className="items-center justify-center lg:py-0 py-4  w-full">
                        <PopularityDiagram props={cityPopularity} />
                    </div>
                </div>
                <div className="md:flex-1 p-2 py-10">
                    <h1 className="text-3xl font-semibold">Cities</h1>
                    <p className="md:text-lg text-md indent-6">
                        Most popular is of course capital of Poland <b>Warsaw</b>, next are Krakow and Wroclaw. There are no many changes over the years. These cities are most popular among Software engineers.
                    </p>
                    <h1 className="text-3xl font-semibold mt-5">Techs</h1>
                    <p className="md:text-lg text-md indent-6">
                        The most popular in offers was SQL more generally relational databases, the next was Docker and Kubernetes and on the third place was Python. The second one comes from that most offers were for seniors and they usually need to know these kind of tools.
                    </p>
                </div>
                <PopularityDiagram props={technologiesPopularity} />
            </div>
        </>
    );
}