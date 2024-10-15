import type { Obj } from "@velmoo/types";
import type { PluginCreator } from "tailwindcss/types/config";

const getThemeColors = (theme: Parameters<PluginCreator>["0"]["theme"]) => {
  const themeColors = theme("colors");
  if (!themeColors) throw new Error("No colors defined in theme");

  let result: Obj<string> = {};

  const checkColors = (colors = themeColors, prevColorKey?: string) => {
    for (const colorKey in colors) {
      const color = colors[colorKey];
      if (typeof color === "string") {
        if (prevColorKey) {
          if (colorKey === "DEFAULT") {
            result[prevColorKey] = color;
          } else {
            result[`${prevColorKey}-${colorKey}`] = color;
          }
        } else {
          result[colorKey] = color;
        }
      } else {
        checkColors(color, colorKey);
      }
    }
  };

  checkColors();

  return result;
};

export default getThemeColors;
