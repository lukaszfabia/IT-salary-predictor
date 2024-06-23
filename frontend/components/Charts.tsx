// create your chart component here
"use client";

import { Bar, Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartData,
  Point,
  BubbleDataPoint,
} from "chart.js";

import LoadingSpinner from "@/components/LoadingSpinner";
import { CreatePlotProps, SalaryStats } from "@/lib/types";
import api from "@/lib/api";
import React, { useState, useEffect, Suspense } from "react";
import { getRandomColorsForPie } from "@/lib";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  BarElement,
  ArcElement,
  Legend
);

const CreatePlot: React.FC<CreatePlotProps> = ({
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
        <LoadingSpinner />
      )}
    </>
  );
};

export const SalaryDiagram = () => {
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

  useEffect(() => {
    api
      .get<SalaryStats[]>("/salary-stats/")
      .then((response) => {
        const data = response.data;

        const labels = data.map((item) => `${item.exp} (${item.contract})`);
        const means = data.map((item) => item.mean);
        const mins = data.map((item) => item.min);
        const maxs = data.map((item) => item.max);

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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <CreatePlot
      chartData={chartData}
      component={Bar}
      type="bar"
      title="Salary statistics"
    />
  );
};

export const PieChart = ({
  kategory,
  title,
}: {
  kategory: string;
  title: string;
}) => {
  const [chartData, setChartData] = useState<
    ChartData<
      "pie",
      (number | [number, number] | Point | BubbleDataPoint | null)[],
      unknown
    >
  >({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    api
      .get(`${kategory}`)
      .then((response) => {
        const data = response.data;

        const labels = Object.keys(data);
        const values = Object.values(data) as number[];

        const colors = labels.map(() => getRandomColorsForPie());

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Distribution",
              data: values,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace("0.2", "1")),
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [kategory]);

  return (
    <CreatePlot
      chartData={chartData}
      component={Pie}
      title={title}
      type="pie"
    />
  );
};

export const PopularityDiagram = ({
  kategory,
  title,
}: {
  kategory: string;
  title: string;
}) => {
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

  useEffect(() => {
    api
      .get(`${kategory}`)
      .then((response) => {
        const data = response.data;

        const labels = Object.keys(data).map(
          (item) => item.charAt(0).toUpperCase() + item.slice(1)
        );
        const values = Object.values(data) as number[];

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Amount",
              data: values,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderColor: "rgba(255, 255, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [kategory]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreatePlot
        chartData={chartData}
        component={Bar}
        title={title}
        type="bar"
      />
    </Suspense>
  );
};
