export const fetcher = async (url: string) =>
  fetch(url).then((resp: Response) => resp.json());
