"use client";

import { Layout } from "../../components/Layout";
import {
  PieChart,
  PopularityDiagram,
  SalaryDiagram,
} from "../../components/Charts";
import { DescElements } from "@/lib/types";

function Description(elem: DescElements) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl" id={`${elem.anchor}`}>
        {elem.title}
        <a
          href={`#${elem.anchor}`}
          className="text-transparent hover:text-violet-800 transition ease-in-out hover:underline"
        >
          #
        </a>
      </h1>
      <p className="text-gray-400 text-lg m-4">{elem.text}</p>
    </div>
  );
}

export default function Stats() {
  return (
    <Layout>
      <div className="mx-5 flex flex-wrap py-28">
        <Description
          anchor="salary-stats"
          title="Salary statistics"
          text="Currently there are <b>[amount of jobs]</b>, vistualization is down
            below. At beginning we have some stats about salaries depend from
            contract. These salaries are at a good level because we have a
            higher salary for Mid and Senior on b2b than on uop, for a junior it
            is the other way around. The reason may be that they receive an
            employment contract very good programmers or there are few job
            offers for juniors in b2b."
        />
        <SalaryDiagram />
      </div>

      <div className="mx-5">
        <Description
          anchor="distributions"
          title="Interesting distributions"
          text="Some text"
        />
        <div className="flex flex-wrap justify-center items-center">
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <PieChart kategory="exp" title="Experience distribution" />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <PieChart kategory="modes" title="Operating mode distribution" />
          </div>
          <div className="w-full sm:w-1/2 md:w-1/3 p-4">
            <PieChart kategory="contracts" title="Contracts distribution" />
          </div>
        </div>
      </div>

      <div className="mx-5 py-28">
        <Description
          anchor="locations"
          title="Popular locations"
          text="Some text"
        />
        <div className="flex flex-wrap justify-center items-center">
          <div className="w-full p-4">
            <PopularityDiagram
              kategory="locations"
              title="Popular locations in IT offers"
            />
          </div>
          <div className="w-full p-4">
            <PopularityDiagram
              kategory="technologies"
              title="Popular technologies in IT offers"
            />
          </div>
        </div>
      </div>

      <div className="mt-10"></div>
    </Layout>
  );
}
