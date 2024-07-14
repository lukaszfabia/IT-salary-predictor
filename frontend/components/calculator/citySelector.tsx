import { Select, SelectItem } from "@nextui-org/select";
import { FC, useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import useSWR from 'swr';
import { fetcher } from "../fetcher";
import { Kategory } from "@/types";



export const SelectCity: FC = () => {

    const endpoint = `${process.env.NEXT_PUBLIC_API}/locations/`;
    const { data, error, isLoading } = useSWR(endpoint, fetcher);

    if (error) return null;
    if (isLoading) return <Spinner />

    return (
        <Select
            items={data}
            label="Your city"
            placeholder="Select a city"
            className="max-w-xs"
            required
        >
            {(kategory: Kategory) => <SelectItem key={kategory.id}>{kategory.name}</SelectItem>}
        </Select>
    );
};
