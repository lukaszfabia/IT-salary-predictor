export const fetcher = async (url: string) => fetch(url).then((resp: any) => resp.json())