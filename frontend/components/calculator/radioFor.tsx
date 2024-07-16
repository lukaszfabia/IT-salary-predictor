import { Kategory } from "@/types";
import { RadioGroup, Radio } from "@nextui-org/react";
import { title } from "../primitives";
import { ChangeEvent, FC } from "react";

export const RadioFor: FC<{
  data: Kategory[];
  label: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ data, label, handleChange }) => {
  return (
    <>
      <h1 className={title({ size: "xs", color: "foreground" })}>{label}</h1>
      <RadioGroup
        className="gap-1 py-2"
        name={label}
        isRequired
        orientation="horizontal"
        onChange={handleChange}
      >
        {data.map((elem: Kategory) => (
          <Radio key={elem.id} value={elem.name} color="secondary">
            {elem.name}
          </Radio>
        ))}
      </RadioGroup>
    </>
  );
};
