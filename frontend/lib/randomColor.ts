export function getRandomColorsForPie(offset: number = 150, factor: number = 105, a: number = 0.2): string {
    const r = Math.floor(Math.random() * factor) + offset;
    const g = Math.floor(Math.random() * factor) + offset;
    const b = Math.floor(Math.random() * factor) + offset;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}