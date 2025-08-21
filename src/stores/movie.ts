import { defineStore } from 'pinia'
import type { Movie } from '@/types/movie'

export const useMovieStore = defineStore('movies', {
  state: () => ({
    movies: [] as Movie[],
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
    setMovies(movies: Movie[]) {
      this.movies = movies
    },
  },
})
