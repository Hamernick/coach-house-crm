"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      className="text-sm underline"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
    >
      {next === "dark" ? "Dark mode" : "Light mode"}
    </button>
  );
}
