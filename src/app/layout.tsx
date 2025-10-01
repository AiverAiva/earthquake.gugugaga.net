import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "台灣地震資料視覺化地圖",
  description: "提供台灣歷年地震資料的視覺化與篩選功能。",
  openGraph: {
    images: "/cow.png",
  },
  themeColor: "#3B5323",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-serif`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics/>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
