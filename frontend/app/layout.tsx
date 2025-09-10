import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans'; 
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import Header from "@/components/Header";
import { AuthProvider } from "@/contexts/AuthContext";

// The font is instantiated directly from the import.
const geistSans = GeistSans;

export const metadata: Metadata = {
  title: "GATI Traffic Simulation",
  description: "A traffic simulation and monitoring application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-100`}>
        <AuthProvider>
          <Header /> 
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

