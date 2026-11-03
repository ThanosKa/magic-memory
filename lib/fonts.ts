import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

export const FONT_SANS = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const FONT_SERIF = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const FONT_MONO = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

/**
 * CSS variables for the three theme fonts, set once on <html> in the root layout.
 * app/globals.css maps them to Tailwind's font-sans, font-serif and font-mono.
 */
export const FONT_VARIABLES = `${FONT_SANS.variable} ${FONT_SERIF.variable} ${FONT_MONO.variable}`;
