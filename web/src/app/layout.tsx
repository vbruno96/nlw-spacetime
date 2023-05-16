import './globals.css'
import { Bai_Jamjuree as BaiJamjuree, Roboto_Flex as Roboto } from 'next/font/google'

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' },)
const baiJamjuree = BaiJamjuree({ subsets: ['latin'], weight: '700', variable: '--font-title' })

export const metadata = {
  title: 'NLW Spacetime',
  description: 'Uma cápsula do tempo construída com React, Next.js, TailwindCSS e TypeScript.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${baiJamjuree.variable} font-sans`}>{children}</body>
    </html>
  )
}
