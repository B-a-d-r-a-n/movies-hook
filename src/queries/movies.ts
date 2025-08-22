import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import * as moviesService from '@/api/moviesService'
import type { Movie } from '@/types/movie'
import type { Ref } from 'vue'

const moviesQueryKeys = {
  all: ['movies'] as const,
  sorted: (sortBy: string, sortOrder: string) => ['movies', sortBy, sortOrder] as const,
}

interface UseMoviesQueryOptions {
  sortBy: Ref<string>
  sortOrder: Ref<'asc' | 'desc'>
}

export const useMoviesQuery = (options: UseMoviesQueryOptions) => {
  return useQuery({
    queryKey: computed(() => moviesQueryKeys.sorted(options.sortBy.value, options.sortOrder.value)),
    queryFn: () =>
      moviesService.getMovies({
        sortBy: options.sortBy.value,
        sortOrder: options.sortOrder.value,
      }),
  })
}

export const useAddMovieMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moviesService.createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moviesQueryKeys.all })
    },
  })
}

export const useUpdateMovieMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moviesService.updateMovie,
    onMutate: async (updatedMovie: Movie) => {
      await queryClient.cancelQueries({ queryKey: moviesQueryKeys.all })

      const previousMovies = queryClient.getQueryData<Movie[]>(moviesQueryKeys.all)

      queryClient.setQueryData<Movie[]>(moviesQueryKeys.all, (old) =>
        old ? old.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)) : [],
      )

      return { previousMovies }
    },
    onError: (err, newTodo, context) => {
      if (context?.previousMovies) {
        queryClient.setQueryData(moviesQueryKeys.all, context.previousMovies)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: moviesQueryKeys.all })
    },
  })
}

export const useDeleteMovieMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moviesService.deleteMovie,
    onMutate: async (movieId: number) => {
      await queryClient.cancelQueries({ queryKey: moviesQueryKeys.all })
      const previousMovies = queryClient.getQueryData<Movie[]>(moviesQueryKeys.all)
      queryClient.setQueryData<Movie[]>(moviesQueryKeys.all, (old) =>
        old ? old.filter((m) => m.id !== movieId) : [],
      )
      return { previousMovies }
    },
    onError: (err, newTodo, context) => {
      if (context?.previousMovies) {
        queryClient.setQueryData(moviesQueryKeys.all, context.previousMovies)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: moviesQueryKeys.all })
    },
  })
}
