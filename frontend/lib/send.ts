import { Input, Output } from "@/types";
import { api } from "@/config/api";



export default function send(input: Input): Promise<number> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  };

  return fetch(`${api}/get-salary/`, requestOptions)
    .then((response: Response) => response.json())
    .then((data: Output) => data.salary)
    .catch(() => 0);
}
