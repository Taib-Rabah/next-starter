import { generateValues } from "./utils";

export const percentages = generateValues({ range: [0, 100, 5], key: "$K%", value: "$V%" })?.values;
