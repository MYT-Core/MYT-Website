import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MYT — Private by design",
  description: "An open-source, privacy-focused proof-of-work network for machine settlement.",
  icons: { icon: "/favicon-32x32.png", apple: "/apple-icon.png" },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
