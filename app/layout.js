import { Inter } from 'next/font/google'
import 'bulma/css/bulma.min.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Vote4it',
  description: 'Create and hold a vote',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {children}
      </body>
    </html>
  )
}
