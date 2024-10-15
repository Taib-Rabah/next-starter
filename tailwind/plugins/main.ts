import plugin from "tailwindcss/plugin";
import { generateValues, fixObject, getThemeColors } from "../utils";
import type { CSSRuleObject } from "tailwindcss/types/config";
import type { Obj } from "@velmoo/types";
import { percentages } from "../shared";

const mainPlugin = plugin(
  ({ addVariant, matchVariant, addUtilities, matchUtilities, theme, addComponents, matchComponents }) => {
    // ? Constants ? //
    const colors = getThemeColors(theme);

    // ? Utils ? //
    const addVariantWithPeerAndGroup = (name: string, definition: string) => {
      addVariant(name, `&${definition}`);
      addVariant(`group-${name}`, `.group${definition} &`);
      addVariant(`peer-${name}`, `.peer${definition} ~ &`);
    };

    const _matchVariant = (name: string, definition: string) => {
      matchVariant(name, (value) => `&${definition.replace("$V", value)}`);
      matchVariant(name, (value) => `.group${definition.replace("$V", value)} &`);
      matchVariant(name, (value) => `.peer${definition.replace("$V", value)} ~ &`);
    };

    // ? :hover & :focus-visible ? //
    addVariantWithPeerAndGroup("hocus", ":where(:hover, :focus-visible)");

    // ? light variant ? //
    addVariant("light", "&:is(.light *)");

    // ? can(t) hover ? //
    addVariant("can-hover", "@media (hover: hover)");
    addVariant("cant-hover", "@media (hover: none)");

    // ? :not() ? //
    _matchVariant("not", ":not($V)");

    // ? ::before & ::after ? //
    addVariant("pseudo", ["&::before", "&::after"]);

    // ? Opposite media queries ? //
    const screens = theme("screens", {});

    for (const [key, value] of Object.entries(screens)) {
      addVariant(key, `@media (width >= ${value})`);
      addVariant(`-${key}`, `@media (width <= ${value})`);
    }

    // ? Border width/color ? //
    const borderWithValues = generateValues({
      range: [0, 8],
      value: "$Vrem",
      divider: 16,
    })?.values;

    matchUtilities(
      {
        b: (borderWidth, { modifier: borderColor }) => ({ borderWidth, borderColor }),
        bt: (borderTopWidth, { modifier: borderTopColor }) => ({ borderTopWidth, borderTopColor }),
        br: (borderRightWidth, { modifier: borderRightColor }) => ({ borderRightWidth, borderRightColor }),
        bb: (borderBottomWidth, { modifier: borderBottomColor }) => ({
          borderBottomWidth,
          borderBottomColor,
        }),
        bl: (borderLeftWidth, { modifier: borderLeftColor }) => ({ borderLeftWidth, borderLeftColor }),
      },
      {
        values: borderWithValues,
        modifiers: colors,
      },
    );

    matchUtilities(
      {
        b: (borderColor, { modifier: opacity }) => ({ borderColor }),
        bt: (borderTopColor, { modifier: opacity }) => ({ borderTopColor }),
        br: (borderRightColor, { modifier: opacity }) => ({ borderRightColor }),
        bb: (borderBottomColor, { modifier: opacity }) => ({ borderBottomColor }),
        bl: (borderLeftColor, { modifier: opacity }) => ({ borderLeftColor }),
      },
      {
        values: colors,
      },
    );

    // ? Translate ? //
    let translateValues = theme("translate") as Record<string, string>;
    translateValues = {
      ...translateValues,
      ...fixObject({ obj: translateValues, key: "-$K", value: "-$V" }),
    };

    matchUtilities(
      {
        x: (value) => ({
          "--x": value,
          translate: "var(--x) var(--y, 0)",
        }),
        y: (value) => ({
          "--y": value,
          translate: "var(--x, 0) var(--y)",
        }),
      },
      {
        values: translateValues,
        type: "length",
      },
    );

    matchUtilities(
      {
        xy: (value, { modifier }) => ({
          "--x": value,
          "--y": modifier ?? value,
          translate: "var(--x) var(--y)",
        }),
      },
      {
        values: translateValues,
        modifiers: translateValues,
        type: "length",
      },
    );

    // ? duration/delay inherit ? //
    addUtilities({
      ".duration-inherit": {
        "transition-duration": "inherit",
        "animation-duration": "inherit",
      },
      ".delay-inherit": {
        "transition-delay": "inherit",
        "animation-delay": "inherit",
      },
    });

    // ? light/dark text color ? //
    const addColorWithDarkVariant =
      (property: string) =>
      (value: string, { modifier }: { modifier: string | null }): CSSRuleObject | null => ({
        [property]: value,
        "&:is(.dark *)": !modifier
          ? null
          : {
              [property]: modifier,
            },
      });

    const colorUtilities: Obj<
      (value: string, { modifier }: { modifier: string | null }) => CSSRuleObject | null
    > = {};

    const colorProperties = {
      Text: "color",
      B: "border-color",
      Bt: "border-top-color",
      Br: "border-right-color",
      Bb: "border-bottom-color",
      Bl: "border-left-color",
      Fill: "fill",
      Stroke: "stroke",
      Outline: "outline-color",
      Bg: "background-color",
      Caret: "caret-color",
    };

    for (const [name, property] of Object.entries(colorProperties)) {
      colorUtilities[name] = addColorWithDarkVariant(property);
    }

    matchUtilities(colorUtilities, { values: colors, modifiers: colors, type: "color" });

    // ? Dev variant ? //
    // To apply some utility classes only in development (currently there's no way to make the build fail when this variant is used)
    addVariant("dev", "&");

    // ? Wrapper ? //
    addComponents({
      ".wrapper": {
        "@apply w-full max-w-screen-2xl mx-auto ~xs/2xl:~px-4/12": "",
      },
    });

    // ? Center with grid/flex ? //
    addComponents({
      ".flex-center": {
        alignItems: "center",
        justifyContent: "center",
      },
      ".grid-center": {
        placeItems: "center",
        placeContent: "center",
      },
    });

    // ? Absolute with grid ? //
    addComponents({
      ".absolute-grid": {
        display: "grid",
        gridTemplateAreas: "'single-area'",
        "& > *": {
          gridArea: "single-area",
        },
      },
    });

    // ? ::before underline ? //

    addComponents({
      ".bu": {
        "@apply relative before:duration-250 before:content-empty before:absolute before:w-full before:h-0.1em before:bottom-0 before:left-0 before:bg-current before:rounded-full":
          "",
      },
    });
    addComponents({
      ".bu-hide": {
        "@apply before:w-0": "",
      },
      ".bu-hide-left": {
        "@apply before:w-0": "",
      },
      ".bu-hide-center": {
        "@apply before:w-0 before:left-50% before:-x-50%": "",
      },
      ".bu-hide-right": {
        "@apply before:w-0 before:left-100% before:-x-100%": "",
      },
    });
    addUtilities({
      ".bu-show": {
        "@apply before:w-full": "",
      },
    });

    addComponents({
      ".au": {
        "@apply relative after:duration-250 after:content-empty after:absolute after:w-full after:h-0.1em after:bottom-0 after:left-0 after:bg-current after:rounded-full":
          "",
      },
    });
    addComponents({
      ".au-hide": {
        "@apply after:w-0": "",
      },
      ".au-hide-left": {
        "@apply after:w-0": "",
      },
      ".au-hide-center": {
        "@apply after:w-0 after:left-50% after:-x-50%": "",
      },
      ".au-hide-right": {
        "@apply after:w-0 after:left-100% after:-x-100%": "",
      },
    });
    addUtilities({
      ".au-show": {
        "@apply after:w-full": "",
      },
    });
  },
);

export default mainPlugin;
