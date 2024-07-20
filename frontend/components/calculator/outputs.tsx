'use client';

import React, { FC, useEffect, useState } from "react";
import { Button, Chip, Spinner } from "@nextui-org/react";
import { ArrowRight } from "../ui/arrowRight";
import { Input } from "@/types";
import { isArray, isString } from "@/lib/validators"
import { handleSend } from "@/lib/handlers";
import { title } from "@/components/primitives"


export const OutputContent: FC<{ data: Input }> = ({ data }) => {
  const [minInput, setMinInput] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [salary, setSalary] = useState<number>(0);

  useEffect(() => {
    if (data && data.contract && data.city && data.technologies && data.experience && data.mode) {
      setMinInput(true);
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap gap-2 p-10 justify-center items-center">
        {data ? (
          Object.entries(data).map(([key, value]) => (
            isString(value) ? (
              <Chip key={key} variant="dot" className="transition-all ease-in-out duration-300 hover:scale-105">
                {value}
              </Chip>
            ) : isArray(value) ? (
              (Array.isArray(value) ? value : [value]).map((val: string) => (
                <Chip key={val} variant="flat" className="transition-all ease-in-out duration-300 hover:scale-105">
                  {val}
                </Chip>
              ))
            ) : null
          ))
        ) : null}
      </div>

      {minInput && (
        <div className="flex justify-center items-center">
          <Button
            type="submit"
            onClick={() => {
              handleSend(data, setLoading, setSalary);
            }}
          >
            {loading ? <Spinner color="default" /> : <ArrowRight />}
          </Button>
        </div>
      )}
      {salary > 0 && (
        <div className="flex justify-center items-center p-10 pt-10">
          <h1 className={title({ size: "lg", color: "violet" })}>{salary} PLN</h1>
        </div>
      )}
    </>
  );
};