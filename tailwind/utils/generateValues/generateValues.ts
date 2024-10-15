import type { Obj, PartialDeep } from "@velmoo/types";
import type { GenerateValuesParams, Range, RangeWithStep } from "./schema";

import { getDecimalLength, isArr, isNum } from "@velmoo/utils/web";
import { generateValuesParamsSchema } from "./schema";

type StrObj = Obj<string>;

type GenerateValuesReturn = StrObj | null;

type Next = (
  callbackFn: (prevParams: GenerateValuesParams) => GenerateValuesParams,
  includePrevValues?: boolean,
) => GenerateValuesAdvancedReturn;

type GenerateValuesAdvancedReturn = {
  values: StrObj;
  next: Next;
} | null;

function generateValues(params: GenerateValuesParams, prevValues?: StrObj): GenerateValuesAdvancedReturn;
function generateValues(params: GenerateValuesParams[]): GenerateValuesReturn;
function generateValues(
  params: GenerateValuesParams | GenerateValuesParams[],
  prevValues?: StrObj,
): GenerateValuesReturn | GenerateValuesAdvancedReturn {
  const paramsIsArr = isArr(params);
  const paramsArr = paramsIsArr ? params : [params];

  let values: StrObj = { ...prevValues };

  for (const params of paramsArr) {
    const parseResult = generateValuesParamsSchema.safeParse(params);
    if (!parseResult.success) return null;

    const {
      range,
      include,
      exclude,
      custom,
      defaultStep,
      multiplier,
      divider,
      key,
      value,
      sortRanges,
      usePrevStep,
    } = parseResult.data;

    let ranges = (
      typeof range === "number" ? [[0, range, defaultStep]] : isArr(range[0]) ? range : [range]
    ) as RangeWithStep[];

    ranges = ranges.map<RangeWithStep>(([start, end, step]) =>
      start > end ? [end, start, step] : [start, end, step],
    );

    if (sortRanges) {
      ranges.sort((a, b) => a[0] - b[0]);
    }

    let usedStep = defaultStep;

    const excludedNumbers = new Set(exclude.filter(isNum));
    const excludedRanges = exclude.filter(isArr) as Range[];

    const isNumExcluded = (num: number) =>
      excludedNumbers.has(num) || excludedRanges.some(([start, end]) => start <= num && num <= end);

    for (const [start, end, rangeStep] of ranges) {
      if (usePrevStep === true) {
        usedStep = rangeStep ?? usedStep;
      } else {
        usedStep = rangeStep ?? defaultStep;
      }
      const stepDecimalLength = getDecimalLength(usedStep);
      for (let num = start; num <= end; num = +(num + usedStep).toFixed(stepDecimalLength)) {
        if (isNumExcluded(num)) continue;
        const validate = (str: string): string =>
          str.replace(/\$K/g, num.toString()).replace(/\$V/g, `${(num * multiplier) / divider}`);
        const validKey = validate(key);
        const validValue = validate(value);
        values[validKey] = validValue;
      }
    }

    for (const num of include) {
      if (isNumExcluded(num)) continue;
      const validate = (str: string): string =>
        str.replace(/\$K/g, num.toString()).replace(/\$V/g, `${(num * multiplier) / divider}`);
      const validKey = validate(key);
      const validValue = validate(value);
      values[validKey] = validValue;
    }

    values = { ...values, ...custom };
  }

  const next: Next = (callbackFn, includePrevValues = false) => {
    const newParams = callbackFn(params as GenerateValuesParams);
    return generateValues(newParams, includePrevValues ? values : undefined);
  };

  if (!paramsIsArr) {
    return { values, next };
  }
  return values;
}

export default generateValues;
