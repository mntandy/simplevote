import './css/standard.css'
import './css/jammin.css'
import './css/tags.css'
import './css/common.css'
import './css/global.css'

export const metadata = {
  title: 'SimplyVote',
  description: 'Simply vote for something',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
        {children}
    </html>
  )
}
