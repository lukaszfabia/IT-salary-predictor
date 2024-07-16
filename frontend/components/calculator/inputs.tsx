"use client";

import { fetcher } from "../fetcher";
import { Kategory } from "@/types";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import React from "react";
import { TechnologiesCheckboxes } from "./technologiesCheckboxes";
import { LocationSelector } from "./locationSelector";
import { RadioFor } from "./radioFor";
import Error from "@/app/error";

export const InputContent: FC<{
  dataOnChange: (data: string) => void;
}> = ({ dataOnChange }) => {
  const api: string = `${process.env.NEXT_PUBLIC_API}`;

  const endpoints: string[] = [
    `${api}/locations/`, // selector
    `${api}/technologies/`, // checkbox
    `${api}/exp/`, // radio
    `${api}/modes/`, // radio
    `${api}/contracts/`, // radio
  ];

  const [locations, setLocations] = useState<Kategory[]>([]);
  const [technologies, setTechnologies] = useState<Kategory[]>([]);
  const [exps, setExps] = useState<Kategory[]>([]);
  const [modes, setModes] = useState<Kategory[]>([]);
  const [contracts, setContracts] = useState<Kategory[]>([]);

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all(endpoints.map((endpoint: string) => fetcher(endpoint)))
      .then((responses: Kategory[][]) => {
        setLocations(responses[0]);
        setTechnologies(responses[1]);
        setExps(responses[2]);
        setModes(responses[3]);
        setContracts(responses[4]);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    dataOnChange(value);
  };

  if (error) return <Error error={error} reset={() => {}} />;

  if (loading)
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner />
      </div>
    );

  return (
    <>
      <LocationSelector cities={locations} />
      <TechnologiesCheckboxes technologies={technologies} />
      <RadioFor
        data={exps}
        label="Experience"
        handleChange={handleInputChange}
      />
      <RadioFor
        data={modes}
        label="Work mode"
        handleChange={handleInputChange}
      />
      <RadioFor
        data={contracts}
        label="Contract type"
        handleChange={handleInputChange}
      />
    </>
  );
};
