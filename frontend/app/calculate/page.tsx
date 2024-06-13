"use client";
import React, { useEffect, useState } from "react";

import { Layout } from "../../components/Layout";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

const useFetchData = ({ url, key, setData }: { url: string, key: string, setData: (data: any) => void }) => {
  useEffect(() => {
    api.get(url).then((response) => {
      setData(response.data[key]);
    }).catch((error) => {
      console.log(`Error while fetching data from ${url}`, error);
    });
  }, [url, setData]);
}

export default function SalaryCalculator() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [operatingModes, setOperatingModes] = useState<string[]>([]);


  useFetchData({ url: "/locations/", setData: setCities, key: "locations" });

  useFetchData({ url: "/experience/", setData: setExperiences, key: "experience" });

  useFetchData({ url: "/contract-types/", setData: setContractTypes, key: "contract_types" });

  useFetchData({ url: "/operating-modes/", setData: setOperatingModes, key: "operating_modes" });

  useFetchData({
    url: "/technologies/", setData: (data: string[]) => {
      setTechnologies(data);
      setLoading(false);
    }, key: "tech_stacks"
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.getAll("technologies").length === 0) {
      alert("Select at least one technology");
      return;
    }

    const data = {
      city: formData.get("countries"),
      experience: formData.get("list-radio-exp"),
      contractType: formData.get("list-radio-contract"),
      operatingMode: formData.get("list-radio-operating_mode"),
      technologies: formData.getAll("technologies")
    };

    api.post("/get-salary/", data).then((response) => {
      console.log("Salary", response.data);

      router.push(`/calculate/result?salaryData=${encodeURIComponent(JSON.stringify(response.data))}`);
    }).catch((error) => {
      console.log("Error while fetching salary", error);
    });
  };


  return (
    <Layout>
      <div className="mx-auto sm:py-56 lg:py-20">
        <div>
          <h1 className="text-3xl font-bold text-center">Choose parameters</h1>
        </div>

        <form className="max-w-md mx-auto py-4" onSubmit={handleSubmit}>

          {cities.length > 0 && <LocationsSelector cities={cities} />}

          {experiences.length > 0 && <RadioButtons options={experiences} name="exp" />}

          {contractTypes.length > 0 && <RadioButtons options={contractTypes} name="contract" />}

          {operatingModes.length > 0 && <RadioButtons options={operatingModes} name="operating_mode" />}

          {technologies.length > 0 && <TechnologiesButtons technologies={technologies} />}

          {loading && <LoadingSpinner />}

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Calculate
          </button>
        </form>
      </div>
    </Layout>
  );
}

const LocationsSelector = ({ cities }: { cities: string[] }) => {
  return (
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
  );
}



const RadioButtons = ({ options, name }: { options: string[], name: string }) => {
  return (
    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-transparent dark:border-gray-600 dark:text-white mt-5">
      {options.map((op: string, index: number) => (
        <li key={index} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
          <div className="flex items-center px-3 py-3">
            <input
              id={`horizontal-list-radio-id-${index}`}
              type="radio"
              value={op}
              required
              name={`list-radio-${name}`}
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
            name="technologies"
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
