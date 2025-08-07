// In src/app/layout.js
import { Overpass, Red_Hat_Display } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Providers } from './providers';
import "./globals.css";

// Define Red Hat Display with appropriate weights
const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-red-hat",
});

// Keep Overpass for body text
const overpass = Overpass({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-overpass",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "AI Advantage Program | Sports Innovation Lab x Microsoft",
  description: "Discover the latest AI tools for sports innovation, curated by Sports Innovation Lab and TwinBrain AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${overpass.variable} ${redHatDisplay.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}