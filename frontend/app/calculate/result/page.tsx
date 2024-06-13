"use client";

import { Layout } from "@/components/Layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { OutputData } from "@/lib/types";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ResultPage: React.FC = () => {
    const searchParams = useSearchParams();
    const salaryData = searchParams.get('salaryData');
    const [data, setData] = useState<OutputData | null>(null);

    useEffect(() => {
        if (salaryData) {
            setData(JSON.parse(salaryData));
        }
    }, [salaryData]);

    return (
        <Layout>
            {data ? (
                <div className="max-w-lg mx-auto p-6 bg-transparent rounded-lg shadow-md py-32 text-center">
                    <h1 className="text-2xl font-semibold mb-4">Salary Details</h1>
                    <div className="space-y-2 text-lg">
                        <p>Predicted salary in city: <b>{data.city}</b> for <b>{data.experience}</b> begin on <b>{data.contractType}</b>, working <b>{data.operatingMode}</b>,
                            having knowledge about <b>{data.technologies.join(", ")}</b> is</p>
                        <p className="text-3xl font-bold">{data.salary.toFixed(2)} PLN</p>
                    </div>
                </div>
            ) : (
                < LoadingSpinner />
            )}
        </Layout>
    );
};

export default ResultPage;