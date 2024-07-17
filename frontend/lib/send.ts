import { Input } from "@/types";
import { api } from "@/config/api";

export default function send(input: Input): Promise<number> {

    console.log(input);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    };

    return fetch(`${api}/get-salary/`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data.output.salary);
            return data.output.salary;
        })
        .catch(error => 0);

}