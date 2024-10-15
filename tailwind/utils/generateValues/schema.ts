import type { OptionalLast, PartialDeep, ReplaceType } from "@velmoo/types";
import { isArr } from "@velmoo/utils/web";
import { z } from "zod";

const rangeSchema = z.tuple([z.number(), z.number()]);

export type Range = z.infer<typeof rangeSchema>;

const _rangeWithStepSchema = z.tuple([...rangeSchema.items, z.number().optional()]);

type PreprocessHandler = (value: unknown, ctx: z.RefinementCtx) => unknown;

const preprocessHandler: PreprocessHandler = (value) => {
  const items = _rangeWithStepSchema.items;

  // A required item cannot follow an optional item. so the real optional items are the ones at the end of the array.
  const optionalItemsAtTheEnd = items.reduce(
    (optionalItemsAtTheEnd, currItem) => {
      if (currItem.isOptional()) {
        return [...optionalItemsAtTheEnd, currItem];
      } else {
        return [];
      }
    },
    [] as (typeof items)[number][],
  );

  const requiredItemsCount = items.length - optionalItemsAtTheEnd.length;

  if (!isArr(value) || value.length < requiredItemsCount || value.length > items.length) return value;

  const undefineds = Array.from({ length: items.length - value.length });
  const newValue = value.toSpliced(requiredItemsCount, 0, ...undefineds);
  return newValue;
};

const rangeWithStepSchema = z.preprocess(preprocessHandler, _rangeWithStepSchema);

export type RangeWithStep = OptionalLast<z.infer<typeof rangeWithStepSchema>>;

export type RangeParam = number | RangeWithStep | RangeWithStep[];

export const generateValuesParamsSchema = z.object({
  range: z.union([z.number(), rangeWithStepSchema, z.array(rangeWithStepSchema)]),
  include: z.array(z.number()).default([]),
  exclude: z.array(z.union([z.number(), rangeSchema])).default([]),
  sortRanges: z.boolean().default(false),
  usePrevStep: z.boolean().default(false),
  defaultStep: z.number().default(1),
  multiplier: z.number().default(1),
  divider: z.number().default(1),
  key: z.string().default("$K"),
  value: z.string().default("$V"),
  custom: z.record(z.string()).default({}),
});

export type GenerateValuesParams = PartialDeep<
  ReplaceType<z.infer<typeof generateValuesParamsSchema>, "range", RangeParam>,
  "range"
>;
