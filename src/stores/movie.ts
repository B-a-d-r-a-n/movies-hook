import { defineStore } from 'pinia'
import type { Movie } from '@/types/movie'
import apiClient from '@/api/axios'

export const useMovieStore = defineStore('movies', {
  state: () => ({
    movies: [] as Movie[],
    isLoading: false,
  }),

  getters: {
    totalMovies: (state) => state.movies.length,
    averageRating: (state) => {
      if (state.movies.length === 0) return 0
      const ratedMovies = state.movies.filter((m) => m.rating > 0)
      if (ratedMovies.length === 0) return 0
      const sum = ratedMovies.reduce((acc, movie) => acc + (movie.rating || 0), 0)
      return parseFloat((sum / ratedMovies.length).toFixed(1))
    },
  },

  actions: {
    async fetchMovies() {
      this.isLoading = true
      try {
        const response = await apiClient.get('/items')
        this.movies = response.data
      } catch (error) {
        console.error('Failed to fetch movies:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addMovie(movie: Omit<Movie, 'id'>) {
      try {
        const response = await apiClient.post('/items', movie)
        const newMovie = response.data
        this.movies.push(newMovie)
        return newMovie
      } catch (error) {
        console.error('Failed to add movie:', error)
      }
    },

    async updateMovie(updatedMovie: Movie) {
      try {
        const response = await apiClient.put(`/items/${updatedMovie.id}`, updatedMovie)
        const returnedMovie = response.data
        const index = this.movies.findIndex((m) => m.id === returnedMovie.id)
        if (index !== -1) {
          this.movies[index] = returnedMovie
        }
        return returnedMovie
      } catch (error) {
        console.error('Failed to update movie:', error)
      }
    },

    async deleteMovie(movieId: number) {
      try {
        await apiClient.delete(`/items/${movieId}`)
        this.movies = this.movies.filter((m) => m.id !== movieId)
      } catch (error) {
        console.error('Failed to delete movie:', error)
      }
    },

    async updateRating(movieId: number, newRating: number) {
      const movie = this.movies.find((m) => m.id === movieId)
      if (movie) {
        const updatedMovie = { ...movie, rating: newRating }
        await this.updateMovie(updatedMovie)
      }
    },
  },
})
