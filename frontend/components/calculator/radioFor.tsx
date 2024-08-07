import { ChangeEvent, FC } from "react";
import { RadioGroup, Radio } from "@nextui-org/react";

import { Kategory } from "@/types";
import { title } from "@/components/primitives";

export const RadioFor: FC<{
  data: Kategory[];
  label: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ data, label, handleChange }) => {
  return (
    <>
      <h1
        className={`${title({ size: "xs", color: "foreground" })} flex justify-center items-center py-1 lg:justify-start lg:items-start`}
      >
        {label}
      </h1>
      <RadioGroup
        isRequired
        className="gap-2 py-2 flex justify-center items-center lg:justify-start lg:items-start"
        name={label}
        orientation="horizontal"
        onChange={handleChange}
      >
        {data.map((elem: Kategory) => (
          <Radio key={elem.id} color="secondary" value={elem.name}>
            {elem.name}
          </Radio>
        ))}
      </RadioGroup>
    </>
  );
};
