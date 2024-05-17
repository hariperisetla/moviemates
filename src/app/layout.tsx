import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MovieMates",
  description:
    "Your ultimate companion for discovering and sharing movies and series!",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
