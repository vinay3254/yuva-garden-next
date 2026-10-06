import type { Metadata, Viewport } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1b2a1f",
};

export const metadata: Metadata = {
  title: "Yuva Garden Group · Gardens, Designed and Grown",
  description:
    "Landscaping, plants, nursery and garden care from Bettahalsur, Bangalore. From balcony gardens to full estates, we design, build, and maintain green spaces.",
  keywords: [
    "Yuva Garden Group",
    "Bangalore landscaping",
    "Bettahalsur nursery",
    "terrace garden Bangalore",
    "garden maintenance",
    "plants Bangalore",
    "vertical garden",
    "lawn grass Bangalore",
  ],
  authors: [{ name: "Yuva Garden Group" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="font-sans-hanken antialiased bg-[#f4f1ea] text-[#1b2a1f] min-h-screen">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
