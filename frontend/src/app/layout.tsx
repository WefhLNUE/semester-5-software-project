import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../main-theme.css";
import MenuBar from "@/components/MenuBar";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR System",
  description: "Modern HR management system for teams: employees, recruitment, leaves, payroll and performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          margin: 0,
          minHeight: "100vh",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
        }}
      >
        <Providers>
          <MenuBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
