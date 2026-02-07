// reverse proxy to github api
//

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 86400 // 24 hours
export const GET = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname.split('/').slice(3)
  const query = req.nextUrl.searchParams

  query.delete('all')

  const searchString = query.toString()

  const url = `https://api.github.com/${pathname.join('/')}${
    searchString ? `?${searchString}` : ''
  }`

  const headers = new Headers()
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko), Shiro',
  )

  const token = process.env.GH_TOKEN?.trim()
  if (!token) {
    return NextResponse.json(
      { message: 'GH_TOKEN is not set' },
      { status: 500 },
    )
  }

  headers.set('Authorization', `Bearer ${token}`)

  try {
    const response = await fetch(url, { headers })
    const body = await response.text()
    const contentType =
      response.headers.get('content-type') ?? 'application/json'

    return new Response(body, {
      status: response.status,
      headers: {
        'content-type': contentType,
      },
    })
  } catch (error) {
    console.error('[api/gh] proxy request failed', error)
    return NextResponse.json(
      { message: 'GitHub proxy request failed' },
      { status: 502 },
    )
  }
}
