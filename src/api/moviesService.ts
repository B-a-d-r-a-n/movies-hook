import { supabase } from '@/lib/supabase'
import type { Movie } from '@/types/movie'

interface MovieRow {
  id: number
  name: string
  description: string | null
  image: string
  rating: number
  genres: string[]
  in_theaters: boolean
  created_at: string
}

const transformMovieRow = (row: MovieRow): Movie => ({
  id: row.id,
  name: row.name,
  description: row.description || '',
  image: row.image,
  rating: row.rating,
  genres: row.genres,
  inTheaters: row.in_theaters,
})

const transformMovieToRow = (movie: Omit<Movie, 'id'> | Movie) => ({
  name: movie.name,
  description: movie.description || null,
  image: movie.image,
  rating: movie.rating,
  genres: movie.genres,
  in_theaters: movie.inTheaters,
})

export const getMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch movies: ${error.message}`)
  }

  return data.map(transformMovieRow)
}

export const createMovie = async (movie: Omit<Movie, 'id'>): Promise<Movie> => {
  const movieData = transformMovieToRow(movie)

  const { data, error } = await supabase.from('movies').insert([movieData]).select().single()

  if (error) {
    throw new Error(`Failed to create movie: ${error.message}`)
  }

  return transformMovieRow(data)
}

export const updateMovie = async (movie: Movie): Promise<Movie> => {
  const movieData = transformMovieToRow(movie)

  const { data, error } = await supabase
    .from('movies')
    .update(movieData)
    .eq('id', movie.id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update movie: ${error.message}`)
  }

  return transformMovieRow(data)
}

export const deleteMovie = async (movieId: number): Promise<void> => {
  const { error } = await supabase.from('movies').delete().eq('id', movieId)

  if (error) {
    throw new Error(`Failed to delete movie: ${error.message}`)
  }
}
