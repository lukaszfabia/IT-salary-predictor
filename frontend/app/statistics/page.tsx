'use client';

import { title } from "@/components/primitives";
import { api } from "@/config/api";
import { statsChapers } from "@/config/links";
import { fetcher } from "@/lib/fetcher";
import { Divider, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
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
import { CreatePlot } from "@/components/stats/createPlot";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  BarElement,
  ArcElement,
  Legend
);

export type SalaryStats = {
  exp: string;
  contract: string;
  count: string;
  mean: number;
  min: number;
  max: number;
}

const SalaryDist = () => {
  const endpoint: string = `${api}/salary-stats/`;
  const [chartData, setChartData] = useState<
    ChartData<
      "bar",
      (number | [number, number] | Point | BubbleDataPoint | null)[],
      unknown
    >
  >({
    labels: [],
    datasets: [],
  });

  const { data, error, isLoading } = useSWR<SalaryStats[]>(endpoint, fetcher);

  const labels: string[] = data?.map((item) => `${item.exp} (${item.contract})`) || [];
  const means: number[] = data?.map((item) => item.mean) || [];
  const mins: number[] = data?.map((item) => item.min) || [];
  const maxs: number[] = data?.map((item) => item.max) || [];

  useEffect(() => {
    if (data) {
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
  }, [data]);

  if (isLoading) return <div className="flex justify-center items-center"><Spinner color="default" /></div>;
  if (error) return <div>Failed to load</div>;

  return (
    <>
      <h1 className={title()} id={statsChapers[0].anchor}>{statsChapers[0].chapter}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="md:flex-1 p-2 py-10">
          <p className="md:text-lg text-md indent-6">
            I would like to start from the salary distribution in Poland. I think it's important to know how much you can earn in IT. I'll show you the distribution of salaries in Poland and in the world.
          </p>
        </div>
        <div className="md:flex-1 p-2 py-10">
          <div className="flex flex-wrap items-center justify-center lg:py-0 py-4">
            <CreatePlot chartData={chartData} component={Bar} title="Salary Distribution" type="bar" />
          </div>
        </div>
      </div>
    </>
  )
}


export default function StatsPage() {

  const chapters: ReactNode[] = [<SalaryDist />];

  return (
    <div className="flex flex-wrap">
      <article className="w-full">
        {chapters.map((chapter: ReactNode, index: number) => (
          <React.Fragment key={index}>
            {chapter}
            <Divider className="my-3" />
          </React.Fragment>
        ))}
      </article>
    </div>
  );
}
