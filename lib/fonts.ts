import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";

// The three theme fonts, loaded once in the root layout.
// app/globals.css maps them to Tailwind's font-sans, font-serif and font-mono.

export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const fontVariables = `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`;
