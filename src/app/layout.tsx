import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const fot = localFont({
  src: "./fonts/FOT-UDMarugo.ttf",
  variable: "--font-geist-mono",
  weight: "100 400 500 600 900",
});

export const metadata: Metadata = {
  title: "State Management",
  description: "State Management Assignment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${fot.variable} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
