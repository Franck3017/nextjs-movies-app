import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key no configurada' },
        { status: 500 }
      )
    }

    const personId = params.id

    // Fetch person details with combined credits and images
    const personResponse = await fetch(
      `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=combined_credits,images,external_ids`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!personResponse.ok) {
      throw new Error(`Error al obtener datos de TMDB: ${personResponse.status}`)
    }

    const personData = await personResponse.json()

    return NextResponse.json(personData)
  } catch (error) {
    console.error('Error en API person:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
} 