import apiClient from './axios'
import type { Movie } from '@/types/movie'

export const getMovies = async (): Promise<Movie[]> => {
  const response = await apiClient.get('/items')
  return response.data
}

export const createMovie = async (movie: Omit<Movie, 'id'>): Promise<Movie> => {
  const response = await apiClient.post('/items', movie)
  return response.data
}

export const updateMovie = async (movie: Movie): Promise<Movie> => {
  const response = await apiClient.put(`/items/${movie.id}`, movie)
  return response.data
}

export const deleteMovie = async (movieId: number): Promise<void> => {
  await apiClient.delete(`/items/${movieId}`)
}
