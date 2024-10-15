import type { Obj } from "@velmoo/types";

export type FixObjectParams = {
  obj: Obj;
  key?: string;
  value?: string;
};

const fixObject = ({ obj, key: userNewKey = "$K", value: userNewValue = "$V" }: FixObjectParams) => {
  return Object.entries(obj).reduce(
    (acc, [currKey, currValue]) => {
      const validate = (keyOrValue: string) =>
        keyOrValue.replace(/\$K/g, currKey).replace(/\$V/g, `${currValue}`);
      const newKey = validate(userNewKey);
      const newValue = validate(userNewValue);
      acc[newKey] = newValue;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export default fixObject;
