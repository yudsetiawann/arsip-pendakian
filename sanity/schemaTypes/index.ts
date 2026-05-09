import { type SchemaTypeDefinition } from 'sanity'
import { gunungType } from './gunung'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [gunungType],
}
