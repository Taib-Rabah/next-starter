"use client";

import * as React from "react";
import { Moon, Sun, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/shadcn-ui/dropdown-menu";
import { upperFirst } from "@velmoo/utils/web";

export default function ThemeToggler() {
  const { theme: activeTheme, themes, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <ThemeAsItem
            key={theme}
            theme={theme}
            activeTheme={activeTheme ?? "system"}
            onClick={() => setTheme(theme)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type ThemeAsItemProps = {
  theme: string;
  activeTheme: string;
  onClick: () => void;
};

function ThemeAsItem({ theme, activeTheme, onClick }: ThemeAsItemProps) {
  const isActive = theme === activeTheme;
  return (
    <DropdownMenuItem
      disabled={isActive}
      onClick={onClick}
      className={`cursor-pointer ${isActive ? "justify-between" : ""}`}
    >
      <span>{upperFirst(theme)}</span>
      {isActive ? <Check className="h-4 w-4" /> : null}
    </DropdownMenuItem>
  );
}
