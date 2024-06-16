// create your chart component here
"use client";

import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import LoadingSpinner from '@/components/LoadingSpinner';
import { SalaryStats } from '@/lib/types';
import api from '@/lib/api';
import { useState, useEffect } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    BarElement,
    Legend,
);

export const SalaryDiagram = () => {
    const [chartData, setChartData] = useState<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    } | null>(null);

    useEffect(() => {
        api.get<SalaryStats[]>('/salary-stats/')
            .then((response) => {
                const data = response.data;

                const labels = data.map(item => `${item.exp} (${item.contract})`);
                const means = data.map(item => item.mean);
                const mins = data.map(item => item.min);
                const maxs = data.map(item => item.max);

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Mean Salary',
                            data: means,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Min Salary',
                            data: mins,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Max Salary',
                            data: maxs,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);



    return (
        <>
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Salary Statistics'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <LoadingSpinner />
            )}</>
    )
}

