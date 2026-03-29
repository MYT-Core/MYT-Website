import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MYT - Privacy-focused Proof-of-Work Cryptocurrency",
  description:
    "Privacy-focused Proof-of-Work cryptocurrency with true decentralization, confidential transactions, and accessible CPU mining.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased dark`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
