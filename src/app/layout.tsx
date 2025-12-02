import '../styles/index.css'

import type { PropsWithChildren } from 'react'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { init } from './init'
import { InitInClient } from './InitInClient'

init()
export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <InitInClient />
      <Analytics />
      <SpeedInsights />
      {/* <BrowserSupport /> */}
    </>
  )
}
