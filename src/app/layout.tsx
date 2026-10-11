import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { IBM_Plex_Sans_Arabic } from "next/font/google"
import { ThemeProvider } from "@/themes/components/ThemeProvider"
import "./globals.css"

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prism",
  description: "Visual analytics for modern teams",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${plexArabic.variable} antialiased overflow-hidden`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}