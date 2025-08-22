import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const movieSchema = toTypedSchema(
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
