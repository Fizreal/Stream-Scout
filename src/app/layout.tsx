import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './index.css'
import dynamic from 'next/dynamic'
import { SocketProvider } from '@/context/SocketContext'
import { UserProvider } from '@/context/UserContext'
import SiteLayout from '@/components/SiteLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:
    'Stream Scout - Find Shows and Movies Across Your Streaming Subscriptions',
  description:
    'Discover the best shows and movies to watch across all your streaming subscriptions with Stream Scout. Create collaborative watchlists with friends and never miss out on what to watch next. Explore, share, and enjoy your favorite content effortlessly.'
}

const DynamicRedirect = dynamic(() => import('@/hooks/useRedirect'), {
  ssr: false
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full min-h-dvh flex flex-col`}>
        <UserProvider>
          <SocketProvider>
            <DynamicRedirect />
            <SiteLayout>{children}</SiteLayout>
          </SocketProvider>
        </UserProvider>
      </body>
    </html>
  )
}
