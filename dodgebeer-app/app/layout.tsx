// COMPONENTS
import Sidebar from "./components/ui/Sidebar/Sidebar";
// CSS
import "./globals.css";
// METADATA
import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Dodge Beer",
  icons: {
    icon: "/favicon.ico",
  },
};

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
