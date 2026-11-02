import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

export const homeSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-mm-serif",
});

export const homeMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mm-mono",
});
