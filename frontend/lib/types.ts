import { ChartProps } from "react-chartjs-2";

interface BaseData {
  city: string;
  experience: string;
  operatingMode: string;
  contractType: string;
  technologies: string[];
}

export interface InputData extends BaseData {}

export interface OutputData extends BaseData {
  salary: number;
}

export interface SalaryStats {
  exp: string;
  contract: string;
  count: number;
  mean: number;
  min: number;
  max: number;
}

export interface DescElements {
  anchor: string;
  title: string;
  text: string;
}

export interface DataForPie {
  level: string;
  amount: number;
}

export interface CreatePlotProps {
  chartData: ChartProps["data"];
  component: React.ElementType<ChartProps<any, any, any>>;
  [key: string]: any;
}
