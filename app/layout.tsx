import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        `${geistSans.variable} ${geistMono.variable} h-full antialiased`,
      )}
    >
      <head>
        <title>layout-x</title>
        <meta name="description" content="layout-x" />
      </head>
      <body className="flex min-h-full min-w-0 flex-col bg-canvas text-fg-1">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
