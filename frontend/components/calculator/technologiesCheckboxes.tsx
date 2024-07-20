import { Kategory } from "@/types";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { title } from "@/components/primitives"
import { ChangeEvent, FC } from "react";
import { CustomCheckbox } from "../ui/customCheckbox";

export const TechnologiesCheckboxes: FC<{ technologies: Kategory[], handleChange: (name: string, checked: boolean) => void }> = ({
  technologies, handleChange
}) => {

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    handleChange(value, checked);
  };

  return (
    <div className="mt-2">
      <h1 className={`${title({ size: "xs", color: "foreground" })} flex justify-center items-center py-1 lg:justify-start lg:items-start`}>Tech-stack</h1>
      <CheckboxGroup
        className="py-3 gap-1"
        orientation="horizontal"
      >
        {technologies.map((tech: Kategory) => (
          <CustomCheckbox key={tech.id} value={tech.name} onChange={handleCheckboxChange}>
            {tech.name}
          </CustomCheckbox>
        ))}
      </CheckboxGroup>
    </div>
  );
};
