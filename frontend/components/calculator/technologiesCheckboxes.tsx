import { Kategory } from "@/types";
import { CheckboxGroup } from "@nextui-org/checkbox";
import { title } from "../primitives";
import { FC, useState } from "react";
import { CustomCheckbox } from "../ui/customCheckbox";

export const TechnologiesCheckboxes: FC<{ technologies: Kategory[] }> = ({
  technologies,
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="mt-2">
      <h1 className={title({ size: "xs", color: "foreground" })}>Tech-stack</h1>
      <CheckboxGroup
        className="py-3 gap-1"
        orientation="horizontal"
        onChange={setSelected}
        value={selected}
      >
        {technologies.map((tech: Kategory) => (
          <CustomCheckbox key={tech.id} value={tech.name}>
            {tech.name}
          </CustomCheckbox>
        ))}
      </CheckboxGroup>
    </div>
  );
};
