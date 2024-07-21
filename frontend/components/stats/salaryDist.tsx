"use client";

import { FC } from "react";
import { SalaryStats } from "@/types";
import { statsChapers } from "@/config/links";
import { title } from "../primitives";
import { PlotterProps } from "@/types";
import { Plotter } from "./plotter";

function getDataForBar(setChartData: any, data?: SalaryStats[]): void {
    if (data) {

        const labels: string[] = data.map((item) => `${item.exp} (${item.contract})`);
        const means: number[] = data.map((item) => item.mean);
        const mins: number[] = data.map((item) => item.min);
        const maxs: number[] = data.map((item) => item.max);

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Mean Salary",
                    data: means,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Min Salary",
                    data: mins,
                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                    borderColor: "rgba(255, 159, 64, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Max Salary",
                    data: maxs,
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
            ],
        });
    }
}


const propsSalary: PlotterProps<SalaryStats> = {
    kategory: "salary-stats/",
    title: "Most popular working modes",
    type: "bar",
    getData: (setChartData: any, data?: SalaryStats[]): void => getDataForBar(setChartData, data)
}

const SalaryBar: FC = () => {
    return (
        <Plotter props={propsSalary} />
    )
}


export const SalaryDist: FC = () => {
    return (
        <>
            <h1 className={title()} id={statsChapers[0].anchor}>
                {statsChapers[0].chapter}
            </h1>
            <div className="flex flex-col md:flex-row mt-10">
                <div className="md:flex-1 p-2 py-10">
                    <p className="md:text-lg text-md indent-6">
                        I would like to start from the salary distribution in Poland. I
                        think it is important to know how much you can earn in IT. I will
                        show you the distribution of salaries in Poland and in the world.
                        What is important, salaries are quite inflated cause of the big range of requirements on postion.
                    </p>
                    <p className="md:text-lg text-md indent-6">
                        Starting from juniors, we can see that average salary on contract of employment is bigger that on the B2B, I don&apos;t exactly know why but I suppose that there was not to many offers on UoP for them and a average salary was bigger. The situation normalizes for mids and senior, we have bigger salary on B2B than on the UoP. What can be funny that the lowest salary for all of them was for mid on B2B was around 3100 PLN.
                    </p>
                </div>
                <div className="md:flex-1 p-2 py-10">
                    <div className="flex flex-wrap items-center justify-center lg:py-0 py-4">
                        <SalaryBar />
                    </div>
                </div>
            </div>
        </>
    );
};