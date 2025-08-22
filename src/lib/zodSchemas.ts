import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

export const movieFormSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional().default(''),
    image: z.string().min(1, 'Image URL is required').url('Must be a valid URL'),
    genres: z.array(z.string()).default([]),
    inTheaters: z.boolean().default(false),
  }),
)
