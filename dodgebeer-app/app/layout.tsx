// COMPONENTS
import Sidebar from "./components/ui/Sidebar/Sidebar";
// CSS
import "./globals.css";
// METADATA
import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
