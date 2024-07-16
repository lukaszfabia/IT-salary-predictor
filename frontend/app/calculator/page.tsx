"use client";

import { InputContent } from "@/components/calculator/inputs";
import { OutputContent } from "@/components/calculator/outputs";
import { useState } from "react";

export default function CalculatorPage() {
  // const [input, setInput] = useState<string[]>([]);
  const [exp, setExp] = useState<string>("");

  const handleInputChange = (data: string): void => {
    // setInput((prev: string[]) => [...prev, data]);
    setExp(data);
  };

  return (
    <div className="flex p-5">
      <section className="flex-1">
        <InputContent dataOnChange={handleInputChange} />
      </section>
      <section className="flex-1">
        <OutputContent data={[exp]} />
      </section>
    </div>
  );
}
