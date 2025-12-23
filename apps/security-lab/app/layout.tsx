import type { Metadata } from "next";
import "./globals.css";
import "@repo/design-system/styles/globals.css";
import { ThemeProvider } from "@repo/design-system/providers/theme";

export const metadata: Metadata = {
  title: "Security Lab",
  description: "Security testing and experimentation app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
