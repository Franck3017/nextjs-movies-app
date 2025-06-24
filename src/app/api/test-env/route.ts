import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    tmdb: process.env.TMDB_API_KEY,
    imageBase: process.env.NEXT_PUBLIC_IMAGE_BASE_URL
  })
} 