"use client";

import { Layout } from "../../components/Layout";
import { SalaryDiagram } from "../../components/Charts";
import { DescElements } from "@/lib/types";

function Description(elem: DescElements) {
    return (
        <div className="mb-10">
            <h1 className="text-3xl" id={`${elem.anchor}`}>
                {elem.title}<a href={`"#${elem.anchor}"`} className="text-transparent hover:text-violet-800 transition ease-in-out hover:underline">#</a>
            </h1>
            <p className="text-gray-400 text-lg m-4">
                {elem.text}
            </p>
        </div>
    )
}

export default function Stats() {

    return (
        <Layout>
            <div className="mx-5 flex flex-wrap py-56">
                <div className="mb-10">
                    <h1 className="text-3xl" id="salary-stats">
                        Salary statistics<a href="#stats_salary" className="text-transparent hover:text-violet-800 transition ease-in-out hover:underline">#</a>
                    </h1>
                    <p className="text-gray-400 text-lg m-4">
                        Currently there are <b>[amount of jobs]</b>, vistualization is down below. At beginning we have some stats about salaries depend from contract.
                        These salaries are at a good level because we have a higher salary for Mid and Senior
                        on b2b than on uop, for a junior it is the other way around. The reason may be that they receive an employment contract
                        very good programmers or there are few job offers for juniors in b2b.
                    </p>
                </div>
                <SalaryDiagram />
            </div>
        </Layout>
    );
}
