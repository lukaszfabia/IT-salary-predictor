import { Kategory } from "@/types";
import { Select, SelectItem } from "@nextui-org/select";
import { FC } from "react";
import { title } from "../primitives";

export const LocationSelector: FC<{ cities: Kategory[] }> = ({ cities }) => {
  return (
    <div>
      <h1 className={title({ size: "xs", color: "foreground" })}>Location</h1>
      <div className="flex w-50 py-3">
        <Select
          items={cities}
          label="Your city"
          name="city"
          placeholder="Select your city"
          required
        >
          {(elem: Kategory) => (
            <SelectItem key={elem.id}>{elem.name}</SelectItem>
          )}
        </Select>
      </div>
    </div>
  );
};
