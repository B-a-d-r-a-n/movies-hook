<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue'
import { useMovieStore } from '@/stores/movie'
import type { Movie } from '@/types/movie'
import { useNotifications } from '@/composables/useNotifications'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

import {
  useMoviesQuery,
  useAddMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
} from '@/queries/movies'

// Components
import AppHeader from '@/components/AppHeader.vue'
import FilterDrawer from '@/components/FilterDrawer.vue'
import MovieCard from '@/components/MovieCard.vue'
import PaginationControls from '@/components/PaginationControls.vue'

// Headless UI and Icons
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
} from '@headlessui/vue'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid'

// --- TanStack Vue Query ---
const { data: serverMovies, isLoading, isError } = useMoviesQuery()
const { mutate: addMovie } = useAddMovieMutation()
const { mutate: updateMovie } = useUpdateMovieMutation()
const { mutate: deleteMovie } = useDeleteMovieMutation()

const movieStore = useMovieStore()
const { addNotification } = useNotifications()

// Sync server state from Vue Query to Pinia store
watchEffect(() => {
  if (serverMovies.value) {
    movieStore.setMovies(serverMovies.value)
  }
})

// -- Form Validation --
const movieSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    image: z.string().min(1, 'Image URL is required').url('Must be a valid URL'),
    genres: z.array(z.string()).optional(),
    inTheaters: z.boolean().optional(),
    rating: z.number().optional(),
    id: z.number().optional(),
  }),
)

const { handleSubmit, defineField, errors, resetForm, setValues, meta } = useForm({
  validationSchema: movieSchema,
})
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [image, imageAttrs] = defineField('image')
const [genres, genresAttrs] = defineField('genres')
const [inTheaters, inTheatersAttrs] = defineField('inTheaters')

const onSubmit = handleSubmit((values) => {
  const payload = { ...values, rating: editingMovie.value?.rating ?? 0 }
  if (editingMovie.value) {
    updateMovie({ ...payload, id: editingMovie.value.id } as Movie, {
      onSuccess: () => addNotification('Movie updated successfully.', 'success'),
    })
  } else {
    addMovie(payload as Omit<Movie, 'id'>, {
      onSuccess: () => addNotification('Movie added successfully.', 'success'),
    })
  }
  closeForm()
})

// -- Component State --
const isFormOpen = ref(false)
const isConfirmOpen = ref(false)
const isDrawerOpen = ref(false)
const editingMovie = ref<Movie | null>(null)
const movieToDelete = ref<Movie | null>(null)
const allGenres = ref([
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Sci-Fi',
  'Thriller',
  'Crime',
  'Sport',
])

// -- Search and Filter State --
const searchQuery = ref('')
const selectedGenres = ref<string[]>([])
const inTheatersFilter = ref<boolean | null>(null)
const currentPage = ref(1)
const itemsPerPage = 3

// -- Computed Properties --
const filteredMovies = computed(() => {
  let movies = movieStore.movies
  if (searchQuery.value)
    movies = movies.filter((m) => m.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  if (selectedGenres.value.length > 0)
    movies = movies.filter((m) => selectedGenres.value.every((genre) => m.genres.includes(genre)))
  if (inTheatersFilter.value !== null)
    movies = movies.filter((m) => m.inTheaters === inTheatersFilter.value)
  return movies
})
const totalPages = computed(() => Math.ceil(filteredMovies.value.length / itemsPerPage))
const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredMovies.value.slice(start, start + itemsPerPage)
})

watch(
  [searchQuery, selectedGenres, inTheatersFilter],
  () => {
    currentPage.value = 1
  },
  { deep: true },
)

// -- Methods --
const openAddForm = () => {
  editingMovie.value = null
  resetForm({ values: { name: '', description: '', image: '', genres: [], inTheaters: false } })
  isFormOpen.value = true
}
const openEditForm = (movie: Movie) => {
  editingMovie.value = movie
  setValues({ ...movie })
  isFormOpen.value = true
}
const closeForm = () => {
  isFormOpen.value = false
}
const confirmDelete = (movie: Movie) => {
  movieToDelete.value = movie
  isConfirmOpen.value = true
}
const handleDelete = () => {
  if (movieToDelete.value) {
    deleteMovie(movieToDelete.value.id, {
      onSuccess: () => addNotification(`"${movieToDelete.value?.name}" was deleted.`, 'info'),
    })
  }
  isConfirmOpen.value = false
  movieToDelete.value = null
}
const handleUpdateRating = (movie: Movie, rating: number) => {
  updateMovie({ ...movie, rating })
}
const clearFilters = () => {
  searchQuery.value = ''
  selectedGenres.value = []
  inTheatersFilter.value = null
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <AppHeader @add-movie="openAddForm" @open-drawer="isDrawerOpen = true" />

    <FilterDrawer
      :show="isDrawerOpen"
      v-model:searchQuery="searchQuery"
      v-model:selectedGenres="selectedGenres"
      v-model:inTheatersFilter="inTheatersFilter"
      :all-genres="allGenres"
      @close="isDrawerOpen = false"
      @clear="clearFilters"
    />

    <!-- Movie Grid Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="n in 3"
        :key="n"
        class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div class="w-full h-64 bg-zinc-200 dark:bg-zinc-700 animate-pulse"></div>
        <div class="p-6 flex flex-col gap-4">
          <div class="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded"></div>
          <div class="flex gap-2">
            <div class="h-6 w-16 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded-full"></div>
            <div class="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Movie Grid -->
    <div
      v-else-if="paginatedMovies.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      <MovieCard
        v-for="movie in paginatedMovies"
        :key="movie.id"
        :movie="movie"
        @edit="openEditForm(movie)"
        @delete="confirmDelete(movie)"
        @update-rating="handleUpdateRating(movie, $event)"
      />
    </div>
    <div v-else class="text-center py-16">
      <h3 v-if="isError" class="text-xl font-semibold text-red-600 dark:text-red-400">
        Failed to load movies.
      </h3>
      <h3 v-else class="text-xl font-semibold text-zinc-600 dark:text-zinc-400">
        No movies found.
      </h3>
      <p class="text-zinc-500">Try adjusting your filters or search query.</p>
    </div>

    <PaginationControls v-model:currentPage="currentPage" :total-pages="totalPages" />
  </div>

  <!-- Add/Edit Movie Modal -->
  <TransitionRoot appear :show="isFormOpen" as="template">
    <Dialog as="div" @close="closeForm" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-zinc-900 dark:text-white"
                >{{ editingMovie ? 'Edit Movie' : 'Add Movie' }}</DialogTitle
              >
              <form @submit.prevent="onSubmit" class="mt-4 space-y-4">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >Name</label
                  >
                  <input
                    v-model="name"
                    v-bind="nameAttrs"
                    id="name"
                    class="mt-1 block w-full form-input bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                  <p class="text-red-500 dark:text-red-400 text-sm mt-1 h-4">{{ errors.name }}</p>
                </div>
                <div>
                  <label
                    for="description"
                    class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >Description</label
                  >
                  <textarea
                    v-model="description"
                    v-bind="descriptionAttrs"
                    id="description"
                    rows="3"
                    class="mt-1 block w-full form-textarea bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  ></textarea>
                  <p class="text-red-500 dark:text-red-400 text-sm mt-1 h-4">
                    {{ errors.description }}
                  </p>
                </div>
                <div>
                  <label
                    for="image"
                    class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >Image URL</label
                  >
                  <input
                    v-model="image"
                    v-bind="imageAttrs"
                    id="image"
                    class="mt-1 block w-full form-input bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm py-2 px-3 text-zinc-900 dark:text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                  <p class="text-red-500 dark:text-red-400 text-sm mt-1 h-4">{{ errors.image }}</p>
                </div>
                <div>
                  <Listbox v-model="genres" v-bind="genresAttrs" multiple>
                    <div class="relative mt-1">
                      <ListboxButton
                        class="relative w-full cursor-default rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                      >
                        <span
                          class="block truncate text-zinc-900 dark:text-white"
                          v-if="genres && genres.length > 0"
                          >{{ genres.join(', ') }}</span
                        >
                        <span v-else class="text-zinc-500">Select genres</span>
                        <span
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                          ><ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true"
                        /></span>
                      </ListboxButton>
                      <transition
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                      >
                        <ListboxOptions
                          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20"
                        >
                          <ListboxOption
                            v-for="genre in allGenres"
                            :key="genre"
                            :value="genre"
                            v-slot="{ active, selected }"
                          >
                            <li
                              :class="[
                                active
                                  ? 'bg-sky-100 dark:bg-sky-700 text-sky-900 dark:text-white'
                                  : 'text-zinc-900 dark:text-zinc-200',
                                'relative cursor-default select-none py-2 pl-10 pr-4',
                              ]"
                            >
                              <span
                                :class="[
                                  selected ? 'font-medium' : 'font-normal',
                                  'block truncate',
                                ]"
                                >{{ genre }}</span
                              >
                              <span
                                v-if="selected"
                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600 dark:text-sky-400"
                                ><CheckIcon class="h-5 w-5" aria-hidden="true"
                              /></span>
                            </li>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                  <p class="text-red-500 dark:text-red-400 text-sm mt-1 h-4">{{ errors.genres }}</p>
                </div>
                <div class="flex items-center pt-2">
                  <Switch
                    v-model="inTheaters"
                    v-bind="inTheatersAttrs"
                    :class="inTheaters ? 'bg-sky-600' : 'bg-zinc-200 dark:bg-zinc-700'"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                  >
                    <span
                      :class="inTheaters ? 'translate-x-6' : 'translate-x-1'"
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                    />
                  </Switch>
                  <label class="ml-3 block text-sm text-zinc-700 dark:text-zinc-300"
                    >In Theaters</label
                  >
                </div>
                <div class="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                    @click="closeForm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="!meta.valid"
                    class="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed"
                  >
                    {{ editingMovie ? 'Update' : 'Create' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Confirmation Dialog -->
  <TransitionRoot appear :show="isConfirmOpen" as="template">
    <Dialog as="div" @close="isConfirmOpen = false" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-zinc-900 dark:text-white"
                >Delete Movie</DialogTitle
              >
              <div class="mt-2">
                <p class="text-sm text-zinc-600 dark:text-zinc-400">
                  Are you sure you want to delete "{{ movieToDelete?.name }}"? This action cannot be
                  undone.
                </p>
              </div>
              <div class="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-zinc-100 dark:bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                  @click="isConfirmOpen = false"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  @click="handleDelete"
                >
                  Delete
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
