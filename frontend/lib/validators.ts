export function isArray(value: string | string[]): boolean {
  return Array.isArray(value) && value.length > 0;
}

export function isString(value: string | string[]): boolean {
  return typeof value === "string" && value !== "";
}
