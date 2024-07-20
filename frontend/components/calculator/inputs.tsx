"use client";

import { fetcher } from "../../lib/fetcher";
import { Kategory } from "@/types";
import { FC, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import React from "react";
import { TechnologiesCheckboxes } from "./technologiesCheckboxes";
import { LocationSelector } from "./locationSelector";
import { RadioFor } from "./radioFor";
import Error from "@/app/error";
import { endpointKategories as endpoints } from "@/config/api";
import { handleChange } from "@/lib/handlers"


export const InputContent: FC<{
  dataOnChange: (key: string, value: string) => void, handleTechnologiesChange: (name: string, checked: boolean) => void
}> = ({ dataOnChange, handleTechnologiesChange }) => {

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


  if (error) return <Error error={error} reset={() => { }} />;

  if (loading)
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner color="default" />
      </div>
    );

  return (
    <>
      <LocationSelector cities={locations} handleChange={handleChange<HTMLSelectElement>(
        { key: "city", dataOnChange: dataOnChange }
      )} />
      <TechnologiesCheckboxes technologies={technologies} handleChange={handleTechnologiesChange} />
      <RadioFor
        data={exps}
        label="Experience"
        handleChange={handleChange<HTMLInputElement>(
          { key: "experience", dataOnChange: dataOnChange }
        )}
      />
      <RadioFor
        data={modes}
        label="Work mode"
        handleChange={handleChange<HTMLInputElement>(
          { key: "mode", dataOnChange: dataOnChange }
        )}
      />
      <RadioFor
        data={contracts}
        label="Contract type"
        handleChange={handleChange<HTMLInputElement>(
          { key: "contract", dataOnChange: dataOnChange }
        )}
      />
    </>
  );
};
