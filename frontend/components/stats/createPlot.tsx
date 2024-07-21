"use client";

import React from "react";
import { ChartProps } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  CategoryScale,
  ArcElement,
} from "chart.js";
import { Spinner } from "@nextui-org/spinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  ArcElement,
  Legend,
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
        <div className="flex justify-center items-center">
          <Spinner color="default" />
        </div>
      )}
    </>
  );
};
