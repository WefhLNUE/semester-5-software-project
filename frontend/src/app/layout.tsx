'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "../../main-theme.css";
import MenuBar from "@/components/MenuBar";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata moved to head manually since layout is now 'use client'
// export const metadata: Metadata = {
//   title: "HR System",
//   description: "Modern HR management system for teams: employees, recruitment, leaves, payroll and performance.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <title>HR System</title>
        <meta name="description" content="Modern HR management system for teams: employees, recruitment, leaves, payroll and performance." />
      </head>
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
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MenuBar />
            <main>{children}</main>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
