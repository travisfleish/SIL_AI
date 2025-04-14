import { Overpass, Roboto } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const overpass = Overpass({
  variable: "--font-overpass",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SportsTech AI Tools | Sports Innovation Lab & TwinBrain AI",
  description: "Discover the latest AI tools for sports innovation, curated by Sports Innovation Lab and TwinBrain AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${overpass.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}