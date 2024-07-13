import { Select, SelectItem } from "@nextui-org/select";
import { FC, useEffect, useState } from "react";
import useSWR from 'swr';

type LocationData = {
    locations: string[];
};

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return await response.json() as LocationData;
};

export const SelectCity: FC = () => {
    const endpoint = `${process.env.NEXT_PUBLIC_API}/locations/`;
    const { data, error } = useSWR<LocationData>(endpoint, fetcher);
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        if (data) {
            setCities(data.locations);
        }
    }, [data]);

    if (error) return null;

    const selectItems = cities.map(city => ({
        key: city,
        label: city
    }));

    return (
        <Select
            id="city"
            items={selectItems}
            label="Your city"
            placeholder="Select city"
            className="max-w-xs"
        >
            {(city: { key: string, label: string }) => (
                <SelectItem key={city.key}>{city.label}</SelectItem>
            )}
        </Select>
    );
};
