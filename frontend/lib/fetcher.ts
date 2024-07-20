export const fetcher = async (url: string, isBlob: boolean = false) =>
  fetch(url).then((resp: Response) => isBlob ? resp.blob() : resp.json());
