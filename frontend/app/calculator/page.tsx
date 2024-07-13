'use client';

import { SelectCity } from "@/components/calculator/citySelector";
import { title } from "@/components/primitives";


export default function CalculatorPage() {
  return (
    <div>
      <h1 className={title()}>Calculator</h1>
      <SelectCity />
    </div>
  );
}
