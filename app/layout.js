import { Inter } from 'next/font/google'
import GlobalProvider from './contexts'
import Layout from '@/app/components/Layout'
import './global.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vote4it',
  description: 'Create and hold a vote',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body className={inter.className}>
      <GlobalProvider>
        <Layout>
          {children}
        </Layout>
      </GlobalProvider>
      </body>
    </html>
  )
}
