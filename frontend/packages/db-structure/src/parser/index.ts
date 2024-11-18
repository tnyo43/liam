import type { DBStructure, Table } from 'src/schema/database'
import schemarbParser from './schemarb'

type SupportedFormat = 'schemarb' | 'postgres'

// biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
const convertToDBStructure = (data: any): DBStructure => {
  return {
    // biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
    tables: data.tables.reduce((acc: Record<string, Table>, table: any) => {
      acc[table.name] = {
        comment: null,
        // biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
        fields: table.fields.map((field: any) => ({
          check: null,
          comment: null,
          default: null,
          increment: false,
          name: field.name,
          notNull: false,
          primary: false,
          type: field.type.type_name,
          unique: false,
        })),
        indices: [],
        name: table.name,
      }
      return acc
    }, {}),
    relationships: {},
  }
}

// biome-ignore lint/suspicious/noExplicitAny: TODO: Generate types with pegjs
const selectParser = (format: SupportedFormat): any => {
  switch (format) {
    case 'schemarb':
      return schemarbParser
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}

const parse = (str: string, format: SupportedFormat): DBStructure => {
  try {
    const parser = selectParser(format)
    const parsedSchema = parser.parse(str)
    const dbStructure = convertToDBStructure(parsedSchema)
    return dbStructure
  } catch (_error) {
    throw new Error('Failed to parse schema')
  }
}

export const Parser = { parse }
export default Parser
