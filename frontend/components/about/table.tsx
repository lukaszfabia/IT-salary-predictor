'use client';
import { api } from "@/config/api";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Spinner } from "@nextui-org/spinner";
import Error from "next/error";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Offer } from "@/types";

export default function ExampleData({ amount }: { amount: number }) {
    const endpoint: string = `${api}/sample/${amount}`;

    const { data, error, isLoading } = useSWR<Offer[]>(endpoint, fetcher);

    if (isLoading) return <div className="flex justify-center items-center"><Spinner color="default" /></div>;
    if (error || !data) return <Error statusCode={404} title="Not found" />;

    const columns: string[] = Object.keys(data[0]);
    const prettyColumns: string[] = columns.map((column: string) => column.charAt(0).toUpperCase() + column.replace(/_/g, " ").slice(1));

    return (
        <Table isStriped aria-label="Example raw offers" className="p-5" >
            <TableHeader>
                {prettyColumns.map((column: string, index: number) => (
                    <TableColumn className="text-center" key={index}>{column}</TableColumn>
                ))}
            </TableHeader>
            <TableBody>
                {data.map((offer: Offer, rowIndex: number) => (
                    <TableRow key={rowIndex}>
                        {columns.map((column: string, colIndex: number) => (
                            <TableCell key={colIndex} className="text-center">
                                {Array.isArray(offer[column as keyof Offer]) ? (offer[column as keyof Offer] as string[]).join(", ") : offer[column as keyof Offer]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
