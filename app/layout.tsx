import './globals.css'
import React from 'react'
export const metadata = { title: 'Karmic Jyotiṣa', description: 'Past‑life themes with explainable logic' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
