import '@/scss/style.scss'
import { ContextProvider } from '@/context/Context'
import Overlay from '@/components/Overlay'

export const metadata = {
  title: 'RPS Game',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className='page'>
          <ContextProvider>
            {children}
            <Overlay />
          </ContextProvider>
        </div>
      </body>
    </html>
  )
}
