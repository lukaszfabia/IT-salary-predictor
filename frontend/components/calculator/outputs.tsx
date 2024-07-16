// tu bedzie cos takiego ze jak cos ustawie w inputach to tutaj pojawi mi sie to co wybrałem i pod tym bedzie
// hajs a api call

import React, { FC } from "react";
import { Button, Chip } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ArrowRight } from "../ui/arrowRight";

export const OutputContent: FC<{ data: string[] }> = ({ data }) => {
  return (
    <div className="flex gap-2">
      {data.map((elem: string, index) => (
        <Chip key={index} variant="flat">
          {elem}
        </Chip>
      ))}
      <Button>
        <ArrowRight />
      </Button>
    </div>
  );
};
