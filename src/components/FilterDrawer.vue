<script setup lang="ts">
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
} from '@headlessui/vue'
import { XMarkIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/outline'

defineProps<{
  show: boolean
  searchQuery: string
  selectedGenres: string[]
  inTheatersFilter: boolean | null
  sortBy: string
  sortOrder: 'asc' | 'desc'
  allGenres: string[]
}>()

defineEmits([
  'update:searchQuery',
  'update:selectedGenres',
  'update:inTheatersFilter',
  'update:sortBy',
  'update:sortOrder',
  'close',
  'clear',
])

const sortOptions = [
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'name', label: 'Name' },
  { value: 'rating', label: 'Rating' },
]
</script>

<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-40">
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
        <div class="flex min-h-full items-start justify-end text-center">
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-300"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <DialogPanel
              class="w-full max-w-sm transform overflow-hidden bg-white dark:bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all min-h-screen"
            >
              <div class="flex justify-between items-center">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-zinc-900 dark:text-white"
                  >Filters & Sorting</DialogTitle
                >
                <button @click="$emit('close')">
                  <XMarkIcon class="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                </button>
              </div>
              <div class="mt-6 space-y-6">
                <div>
                  <label
                    for="search"
                    class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >Search</label
                  >
                  <input
                    :value="searchQuery"
                    @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
                    type="text"
                    id="search"
                    placeholder="Search by name..."
                    class="ps-3 mt-1 w-full form-input bg-white dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-900 dark:text-white focus:ring-sky-500 focus:border-sky-500 py-2.5"
                  />
                </div>
                <div>
                  <Listbox
                    :modelValue="selectedGenres"
                    @update:modelValue="$emit('update:selectedGenres', $event)"
                    multiple
                  >
                    <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >Genre</label
                    >
                    <div class="relative mt-1">
                      <ListboxButton
                        class="relative w-full cursor-default rounded-lg bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span
                          class="block truncate text-zinc-900 dark:text-white"
                          v-if="selectedGenres.length > 0"
                          >{{ selectedGenres.join(', ') }}</span
                        >
                        <span v-else class="text-zinc-500">Select genres...</span>
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
                          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10"
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
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >In Theaters</label
                  >
                  <div class="mt-2 flex space-x-2">
                    <button
                      @click="$emit('update:inTheatersFilter', null)"
                      :class="[
                        'flex-1 px-3 py-2 text-sm rounded-md',
                        inTheatersFilter === null
                          ? 'bg-sky-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600',
                      ]"
                    >
                      All
                    </button>
                    <button
                      @click="$emit('update:inTheatersFilter', true)"
                      :class="[
                        'flex-1 px-3 py-2 text-sm rounded-md',
                        inTheatersFilter === true
                          ? 'bg-sky-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600',
                      ]"
                    >
                      Yes
                    </button>
                    <button
                      @click="$emit('update:inTheatersFilter', false)"
                      :class="[
                        'flex-1 px-3 py-2 text-sm rounded-md',
                        inTheatersFilter === false
                          ? 'bg-sky-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600',
                      ]"
                    >
                      No
                    </button>
                  </div>
                </div>

                <!-- Sort By Section -->
                <div>
                  <Listbox :modelValue="sortBy" @update:modelValue="$emit('update:sortBy', $event)">
                    <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                      >Sort By</label
                    >
                    <div class="relative mt-1">
                      <ListboxButton
                        class="relative w-full cursor-default rounded-lg bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 py-2.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white/75"
                      >
                        <span class="block truncate text-zinc-900 dark:text-white">
                          {{
                            sortOptions.find((option) => option.value === sortBy)?.label ||
                            'Select sort option'
                          }}
                        </span>
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
                          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10"
                        >
                          <ListboxOption
                            v-for="option in sortOptions"
                            :key="option.value"
                            :value="option.value"
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
                                >{{ option.label }}</span
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
                </div>

                <!-- Sort Order Section -->
                <div>
                  <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >Sort Order</label
                  >
                  <div class="mt-2 flex space-x-2">
                    <button
                      @click="$emit('update:sortOrder', 'desc')"
                      :class="[
                        'flex-1 px-3 py-2 text-sm rounded-md',
                        sortOrder === 'desc'
                          ? 'bg-sky-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600',
                      ]"
                    >
                      Descending
                    </button>
                    <button
                      @click="$emit('update:sortOrder', 'asc')"
                      :class="[
                        'flex-1 px-3 py-2 text-sm rounded-md',
                        sortOrder === 'asc'
                          ? 'bg-sky-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600',
                      ]"
                    >
                      Ascending
                    </button>
                  </div>
                </div>

                <button
                  @click="$emit('clear')"
                  class="w-full px-4 py-2 text-sm font-medium text-zinc-800 dark:text-white bg-zinc-200 dark:bg-zinc-600 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700"
                >
                  Clear Filters
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
