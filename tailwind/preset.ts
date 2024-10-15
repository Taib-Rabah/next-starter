import type { Config } from "tailwindcss";
import type { Obj } from "@velmoo/types";

import fluid, { extract } from "fluid-tailwind";
import myPlugins from "./plugins";
import { generateValues, pxToRem } from "./utils";
import { isArr } from "@velmoo/utils/web";
import { percentages } from "./shared";

const _rem = generateValues({
  range: [0, 24, 0.5],
  value: "$Vrem",
  divider: 4,
});

const _em = generateValues({
  range: [0, 1, 0.1],
  key: "$Kem",
  value: "$Vem",
})?.values;

const fontSize = _rem?.next(() => ({ range: [], custom: _em }), true)?.values;

const spacing = _rem
  ?.next(
    (prevParams) => ({
      ...prevParams,
      range: [24, 128],
      custom: percentages,
    }),
    true,
  )
  ?.next(
    () => ({
      range: [0, 16],
      key: "$Kpx",
      value: "$Vrem",
      divider: 16,
      custom: _em,
    }),
    true,
  )?.values;

const opacity = generateValues({
  range: [
    [0, 20],
    [80, 100],
  ],
  divider: 100,
})?.values;

const zIndex = generateValues({
  range: 10,
  custom: {
    top: "999",
  },
})?.values;

const borderWidth = _rem?.next((prevParams) => ({
  ...prevParams,
  divider: 16,
  range: [1, 8],
}))?.values;

const borderRadius = generateValues({
  range: [0, 24],
  value: "$Vrem",
  divider: 16,
})?.values;

const transitionDuration = generateValues({
  range: [
    [0, 500, 50],
    [500, 2000, 100],
  ],
  value: "$Vms",
})?.values;

const generateBoolData = (keys: string | string[]) => {
  const values: Obj<string> = {};
  if (!isArr(keys)) {
    keys = [keys];
  }

  for (const key of keys) {
    values[key] = `${key}='true'`;
    values[`not-${key}`] = `${key}='false'`;
  }

  return values;
};

const boolData = generateBoolData(["visible", "disabled", "selected", "active"]);

const content = {
  empty: "''",
  star: "'*'",
};

const screens = {
  "2xs": pxToRem(375),
  xs: pxToRem(480),
  sm: pxToRem(640),
  md: pxToRem(768),
  md2: pxToRem(890),
  lg: pxToRem(1024),
  xl: pxToRem(1280),
  "2xl": pxToRem(1440),
};

const myPreset: Config = {
  content: [],
  darkMode: "class",
  theme: {
    extend: {
      transitionDuration,
      screens,
      fontSize,
      spacing,
      borderWidth,
      borderRadius,
      opacity,
      zIndex,
      data: {
        ...boolData,
      },
      content,
    },
  },
  plugins: [...myPlugins, fluid],
};

export default myPreset;
