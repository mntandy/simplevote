import Layout from '@/app/components/Layout'
import './global.css'

export const metadata = {
  title: 'Jammin',
  description: 'Stem frem din favoritt',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body>
      <Layout>
          {children}
      </Layout>
      </body>
    </html>
  )
}
