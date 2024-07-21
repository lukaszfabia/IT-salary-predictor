import { useEffect, useState } from "react"
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import { ChartData, BubbleDataPoint, Point } from "chart.js";
import { Bar, Pie, Scatter } from "react-chartjs-2";
import { AcceptedModels, PlotterProps } from "@/types";
import { Spinner } from "@nextui-org/spinner";
import { CreatePlot } from "./createPlot";
import { api } from "@/config/api";


export const Plotter = <T extends AcceptedModels>({ props }: { props: PlotterProps<T> }) => {
    const [chartData, setChartData] = useState<
        ChartData<
            typeof props.type,
            (number | [number, number] | Point | BubbleDataPoint | null)[],
            unknown
        >
    >({
        labels: [],
        datasets: [],
    });

    const { data, error, isLoading } = useSWR<T[]>(`${api}/${props.kategory}`, fetcher);

    useEffect(() => props.getData(setChartData, data), [data, setChartData])

    if (isLoading || error)
        return (
            <div className="flex justify-center items-center">
                <Spinner color="default" />
            </div>
        );

    return (
        <CreatePlot
            chartData={chartData}
            component={props.type === "bar" ? Bar : props.type === "pie" ? Pie : Scatter}
            title={props.title}
            type={props.type}
        />
    );
}

