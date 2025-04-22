// COMPONENTS
import Navbar from "./components/Navbar";
import BootstrapClient from "./components/BoostrapClient";
// CSS
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
// METADATA
import type { Metadata } from "next";
export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mt-4">{children}</main>
        <BootstrapClient />
      </body>
    </html>
  );
}
