import React, { FC, useState } from "react";
import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";
import { UseCheckboxProps } from "@nextui-org/checkbox/dist/use-checkbox.js";
import { checkbox } from "../primitives";
import { CheckIcon } from "./checkIcon";

export const CustomCheckbox = (props: UseCheckboxProps | undefined) => {
  const { children, isSelected, isFocusVisible, getBaseProps, getInputProps } =
    useCheckbox({
      ...props,
    });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        startContent={
          isSelected ? <CheckIcon className="ml-1 text-white" /> : null
        }
        variant="bordered"
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};
