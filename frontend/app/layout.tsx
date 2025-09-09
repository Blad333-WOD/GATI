import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'; // Correct import for Geist Sans
import "./globals.css";
import 'leaflet/dist/leaflet.css'; // Keep the leaflet CSS import
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "GATI Traffic Simulation",
  description: "A traffic simulation and monitoring application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} antialiased bg-gray-100`}
      >
        <Header /> 
        <main>{children}</main>
      </body>
    </html>
  );
}

