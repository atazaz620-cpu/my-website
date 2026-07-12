import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Pahore Academy Mianwali',
  description: 'Academy Management Platform — Pahore Academy Mianwali',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: '#0A0F1C', color: '#F0EBE1', fontFamily: 'Inter, sans-serif' }}>
        {children}
        <Toaster position="top-right" toastOptions={{
          style: { background: '#141d2e', color: '#F0EBE1', border: '1px solid #1e2d47', borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#06090F' } },
          error:   { iconTheme: { primary: '#A83232', secondary: '#F0EBE1' } },
        }} />
      </body>
    </html>
  )
}
