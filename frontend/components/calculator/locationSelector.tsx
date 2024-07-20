import { Kategory } from "@/types";
import { Select, SelectItem } from "@nextui-org/select";
import { ChangeEvent, FC } from "react";
import { title } from "@/components/primitives"

export const LocationSelector: FC<{ cities: Kategory[], handleChange: (e: ChangeEvent<HTMLSelectElement>) => void }> = ({ cities, handleChange }) => {
  return (
    <div>
      <h1 className={`${title({ size: "xs", color: "foreground" })} flex justify-center items-center py-1 lg:justify-start lg:items-start`}>Location</h1>
      <div className="flex lg:w-50 py-3 justify-center items-center">
        <Select
          items={cities}
          label="Your city"
          name="city"
          placeholder="Select your city"
          required
          onChange={handleChange}
        >
          {(elem: Kategory) => (
            <SelectItem key={elem.name}>{elem.name}</SelectItem>
          )}
        </Select>
      </div>
    </div>
  );
};
