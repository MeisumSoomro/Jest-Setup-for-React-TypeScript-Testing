import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import '@/styles/responsive.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Multi-Vendor Platform',
  description: 'A platform for creating and managing groups and courses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  )
} 