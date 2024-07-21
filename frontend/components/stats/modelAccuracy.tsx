import { FC } from "react";
import { api } from "@/config/api";
import { fetcher } from "@/lib/fetcher";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@nextui-org/react";
import useSWR from "swr";
import { title } from "../primitives";
import { statsChapers } from "@/config/links";
import { PlotterProps, PredTestData, Metrics } from "@/types";
import { Plotter } from "./plotter";


const propsscatter: PlotterProps<PredTestData> = {
    kategory: "pred-test-data/",
    title: "How good is model?",
    type: "scatter",
    getData: (setChartData: any, data?: PredTestData[]): void => getXandY(setChartData, data)
}

const AccuracyPlot: FC = () => {


    return <Plotter props={propsscatter} />
}

const ModelMetrics: FC = () => {

    const { data, error, isLoading } = useSWR<Metrics[]>(`${api}/metrics/`, fetcher);

    if (isLoading || error || !data) {
        return (<div className="flex justify-center items-center">
            <Spinner color="default" />
        </div>)
    }

    const keys: string[] = Object.keys(data[0]).slice(1);
    return (<Table aria-label="Example static collection table">
        <TableHeader>
            {keys.map((key: string) => (
                <TableColumn className="text-center" key={key}>{key}</TableColumn>
            ))}
        </TableHeader>
        <TableBody>
            {data.map((row: Metrics, rowInd: number) => (
                <TableRow key={rowInd}>
                    {keys.map((key: string, colInd: number) => (
                        <TableCell className="text-center" key={colInd}>{row[key as keyof Metrics] as number | string}</TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>)
}

export const ModelAccuracy: FC = () => {
    return (
        <>
            <h1 className={title()} id={statsChapers[3].anchor}>
                {statsChapers[3].chapter}
            </h1>
            <div className="flex flex-col md:flex-row mt-10">
                <div className="md:flex-1 p-2 py-10">
                    <h1 className="text-3xl text-center py-4">Model metrics</h1>
                    <div className="flex flex-wrap items-center justify-center lg:py-0 py-4">
                        <ModelMetrics />
                    </div>
                </div>
                <div className="md:flex-1 p-10 md:py-10 py-0">
                    <p className="md:text-lg text-md indent-6">
                        After learning I&apos;ve got <code>GradientBoostingRegressor</code> returned as the best. The other one has very similar errors and r2 and the process of learning was much faster than winner one. Error like <code>rmse</code> or <code>mae</code> are quite big but it comes from little amount of offers with very different variables. Moreover some of the techs appeared mainly for mids like Linux and C.
                    </p>
                </div>
            </div>
            <AccuracyPlot />

            <p className="py-10 md:text-lg text-md indent-6">
                As we can see, we have chart which simply show dependency between test and predicted values. In this case x is my test value, y is predicted. The more the results are concentrated around the red line, the better the model determines the predicted values. What&apos;s more, a model predicts slightly inflated salaries but I think that I had in my dataset really various salaries for juniors or I didn&apos;t match my technologies enough.
            </p>
        </>
    )
}

function getXandY(setChartData: any, data?: PredTestData[]): void {
    if (data) {
        const pairs = data.map((elem: PredTestData) => ({ x: elem.x, y: elem.y }));
        const labels: string[] = data.map((elem: PredTestData) => `id: ${elem.id}`)
        const perfectValues = data.map((elem: PredTestData) => ({ x: elem.x, y: elem.x }))

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Point",
                    data: pairs,
                    backgroundColor: 'rgba(24, 131, 201, 0.8)',
                    borderColor: 'rgba(24, 131, 201, 1)',
                    borderWidth: 1,
                },
                {
                    label: "y=x",
                    data: perfectValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false,
                    type: 'line',
                    pointRadius: 0
                }
            ],
        });
    }


}
