import { ChangeEvent } from "react";
import { Handler, Input } from "../types";
import send from "./send";

export const handleChange = <T extends HTMLSelectElement | HTMLInputElement>(handler: Handler) => (e: ChangeEvent<T>): void => {
    handler.dataOnChange(handler.key, e.target.value);
};


export const handleSend = (data: Input, setLoading: (loading: boolean) => void, setOutput: (salary: number) => void): void => {
    setLoading(true);
    send(data)
        .then(salary => setOutput(salary))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
};