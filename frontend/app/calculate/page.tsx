"use client";
import React, { useEffect, useState } from "react";

import { Layout } from "../../components/Layout";
import api from "@/lib/api";

const useFetchData = ({ url, key, setData }: { url: string, key: string, setData: (data: any) => void }) => {
  useEffect(() => {
    api.get(url).then((response) => {
      console.log(`Fetched data from ${url}`, response.data[key]);
      setData(response.data[key]);
    }).catch((error) => {
      console.log(`Error while fetching data from ${url}`, error);
    });
  }, [url, setData]);
}

export default function SalaryCalculator() {
  const [cities, setCities] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [operatingModes, setOperatingModes] = useState<string[]>([]);


  useFetchData({ url: "/locations/", setData: setCities, key: "locations" });

  useFetchData({ url: "/experience/", setData: setExperiences, key: "experience" });

  useFetchData({ url: "/technologies/", setData: setTechnologies, key: "tech_stacks" });

  useFetchData({ url: "/contract-types/", setData: setContractTypes, key: "contract_types" });

  useFetchData({ url: "/operating-modes/", setData: setOperatingModes, key: "operating_modes" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

  };


  return (
    <Layout>
      <div className="mx-auto sm:py-48 lg:py-20">
        <div>
          <h1 className="text-3xl font-bold text-center">Choose parameters</h1>
        </div>

        <form className="max-w-md mx-auto py-4" onSubmit={handleSubmit}>
          <select
            id="countries"
            name="countries"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {experiences.length > 0 && <RadioButtons options={experiences} />}

          {contractTypes.length > 0 && <RadioButtons options={contractTypes} />}

          {operatingModes.length > 0 && <RadioButtons options={operatingModes} />}

          {technologies.length > 0 && <TechnologiesButtons technologies={technologies} />}

        </form>
      </div>
    </Layout>
  );
}


const RadioButtons = ({ options }: { options: string[] }) => {
  return (
    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-5">
      {options.map((op: string, index: number) => (
        <li key={index} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
          <div className="flex items-center px-3 py-3">
            <input
              id={`horizontal-list-radio-id-${index}`}
              type="radio"
              value={op}
              name="list-radio"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
            />
            <label htmlFor={`horizontal-list-radio-id-${index}`} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{op}</label>
          </div>
        </li>
      ))}
    </ul>
  );
};


const TechnologiesButtons = ({ technologies }: { technologies: string[] }) => {
  const [selectedTechnologies, setselectedTechnologies] = useState<string[]>([]);

  const handleTechnologyClick = (technology: string) => {
    setselectedTechnologies(prevTechnologies => {
      if (prevTechnologies.includes(technology)) {
        return prevTechnologies.filter(t => t !== technology);
      } else {
        return [...prevTechnologies, technology];
      }
    });
  };

  return (
    <div className="mx-auto flex flex-wrap items-center justify-center py-5">
      {technologies.map((technology: string) => (
        <label key={technology} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={technology}
            name={technology}
            value={technology}
            className="sr-only"
            checked={selectedTechnologies.includes(technology)}
            onChange={() => handleTechnologyClick(technology)}
          />
          <span
            className={`${selectedTechnologies.includes(technology)
              ? 'bg-white text-gray-900'
              : 'bg-dark-100 hover:bg-white hover:text-gray-900 hover:transition ease-in-out'
              } mt-2 border border-gray-300 text-sm rounded-lg block w-full p-2.5 hover:cursor-pointer`}
          >
            {technology}
          </span>
        </label>
      ))
      }
    </div >
  );
};
