"use client";

import React from "react";
import { Divider } from "@nextui-org/divider";

import { CollectingData } from "@/components/about/collectingData";
import { DataModel } from "@/components/about/dataModel";
import { Introduction } from "@/components/about/introduction";
import { Motivations } from "@/components/about/motivations";
import { Solution } from "@/components/about/solution";
import { TableOfContents } from "@/components/about/tableOfContents";
import { aboutChapers } from "@/config/links";
import { ChapterComponent } from "@/types";

export default function AboutPage() {
  const chapters: ChapterComponent[] = [
    { chapter: <Introduction />, key: "introduction" },
    { chapter: <Motivations />, key: "motivations" },
    { chapter: <CollectingData />, key: "collecting-data" },
    { chapter: <DataModel />, key: "data-model" },
    { chapter: <Solution />, key: "solution" },
  ];

  return (
    <div className="flex flex-wrap">
      <article className="w-full lg:w-3/4 lg:pr-10">
        {chapters.map((elem: ChapterComponent, index: number) => (
          <React.Fragment key={elem.key}>
            {elem.chapter}
            <Divider key={index} className="my-3" />
          </React.Fragment>
        ))}
      </article>
      <TableOfContents chapters={aboutChapers} />
    </div>
  );
}
