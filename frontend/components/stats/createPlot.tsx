"use client";

import { Bar, ChartProps, Pie } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PieController,
    ArcElement,
    ChartData,
    Point,
    BubbleDataPoint,
} from "chart.js";

import React, { useState, useEffect } from "react";
import { Spinner } from "@nextui-org/spinner";

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    BarElement,
    ArcElement,
    Legend
);


export interface CreatePlotProps {
    chartData: ChartProps["data"];
    component: React.ElementType<ChartProps<any, any, any>>;
    [key: string]: any;
}

export const CreatePlot: React.FC<CreatePlotProps> = ({
    chartData,
    component: Component,
    title,
    ...rest
}) => {
    return (
        <>
            {chartData ? (
                <Component
                    type={rest.type}
                    {...rest}
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: true,
                                text: title || "title",
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    }}
                />
            ) : (
                <div className="flex justify-center items-center"><Spinner color="default" /></div>
            )}
        </>
    );
};