'use client';

import { CollectingData } from "@/components/about/collectingData";
import { DataModel } from "@/components/about/dataModel";
import { Introduction } from "@/components/about/introduction";
import { Motivations } from "@/components/about/motivations";
import { Solution } from "@/components/about/solution";
import { TableOfContents } from "@/components/about/tableOfContents";
import { aboutChapers } from "@/config/links";
import { Divider } from "@nextui-org/divider";
import React, { ReactNode } from "react";


export default function AboutPage() {
  const chapters: ReactNode[] = [
    <Introduction />,
    <Motivations />,
    <CollectingData />,
    <DataModel />,
    <Solution />
  ];

  return (
    <div className="flex flex-wrap">
      <article className="w-full lg:w-3/4 lg:pr-10">
        {chapters.map((chapter: ReactNode, index: number) => (
          <React.Fragment key={index}>
            {chapter}
            <Divider className="my-3" key={index} />
          </React.Fragment>
        ))}
      </article>
      <TableOfContents chapters={aboutChapers} />
    </div>
  );
}
