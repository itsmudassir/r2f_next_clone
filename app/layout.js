// Remove TypeScript imports
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RIGHT2FIX - Auto Parts Marketplace',
  description: 'The right parts at the right place for the right price',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}