import type { Movie } from '@/types/movie'
import { defineStore } from 'pinia'

const API_URL = 'http://localhost:3000/items'

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
        const response = await fetch(API_URL)
        this.movies = await response.json()
      } catch (error) {
        console.error('Failed to fetch movies:', error)
      } finally {
        this.isLoading = false
      }
    },

    async addMovie(movie: Omit<Movie, 'id'>) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...movie, id: Date.now() }),
        })
        const newMovie = await response.json()
        this.movies.push(newMovie)
        return newMovie
      } catch (error) {
        console.error('Failed to add movie:', error)
      }
    },

    async updateMovie(updatedMovie: Movie) {
      try {
        const response = await fetch(`${API_URL}/${updatedMovie.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedMovie),
        })
        const returnedMovie = await response.json()
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
        await fetch(`${API_URL}/${movieId}`, { method: 'DELETE' })
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
