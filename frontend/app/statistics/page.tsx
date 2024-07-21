"use client";

import React from "react";
import { Divider } from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { ChapterComponent } from "@/types";
import { SalaryDist } from "@/components/stats/salaryDist";
import { WorkInIt } from "@/components/stats/otherDists";
import { Popularity } from "@/components/stats/popularity";
import { ModelAccuracy } from "@/components/stats/modelAccuracy";

ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  BarElement,
  ArcElement,
  Legend,
);



export default function StatsPage() {
  const chapters: ChapterComponent[] = [
    { chapter: <SalaryDist />, key: "salary-dist" },
    { chapter: <WorkInIt />, key: "work-in-it" },
    { chapter: <Popularity />, key: "popularity" },
    { chapter: <ModelAccuracy />, key: "model-results" },
  ];

  return (
    <div className="flex flex-wrap">
      <article className="w-full">
        {chapters.map((elem: ChapterComponent) => (
          <React.Fragment key={elem.key}>
            {elem.chapter}
            <Divider className="my-10" />
          </React.Fragment>
        ))}
      </article>
    </div>
  );
}
