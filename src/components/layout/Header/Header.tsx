"use client";

import ThemeToggler from "~/components/ui/ThemeToggler";
import { useVisibility } from "./hooks";

export default function Header() {
  const isVisible = useVisibility();

  return (
    <header
      className="wrapper sticky top-0 z-1 flex justify-between py-6 backdrop-blur-sm duration-500 bb-1 -y-full data-visible:y-0"
      data-visible={isVisible}
    >
      <h1 className="font-semibold ~xs/md2:~text-6/8">Header</h1>
      <ThemeToggler />
    </header>
  );
}
