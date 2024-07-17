"use client";

import { InputContent } from "@/components/calculator/inputs";
import { OutputContent } from "@/components/calculator/outputs";
import { Input } from "@/types";
import { initState } from "@/lib/init";
import { useState } from "react";



export default function CalculatorPage() {
  const [selectedOptions, setSelectedOptions] = useState<Input>(initState);

  const handleInputChange = (key: string, value: string): void => {
    setSelectedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTechnologiesChange = (name: string, checked: boolean): void => {
    if (checked) {
      setSelectedOptions((prev) => ({
        ...prev,
        technologies: [...prev.technologies, name],
      }));
    } else {
      setSelectedOptions((prev) => ({
        ...prev,
        technologies: prev.technologies.filter((tech) => tech !== name),
      }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row p-5">
      <section className="lg:flex-1">
        <InputContent dataOnChange={handleInputChange} handleTechnologiesChange={handleTechnologiesChange} />
      </section>
      <section className="lg:flex-1">
        <OutputContent data={selectedOptions} />
      </section>
    </div>
  );

}
