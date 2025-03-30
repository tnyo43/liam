import * as v from 'valibot'

// Export these schema definitions
export const columnNameSchema = v.string()

export const tableNameSchema = v.string()

export const indexNameSchema = v.string()

export const relationshipNameSchema = v.string()

export const constraintNameSchema = v.string()

export const columnSchema = v.object({
  name: columnNameSchema,
  type: v.string(),
  default: v.nullable(v.union([v.string(), v.number(), v.boolean()])),
  check: v.nullable(v.string()),
  primary: v.boolean(),
  unique: v.boolean(),
  notNull: v.boolean(),
  comment: v.nullable(v.string()),
})

const columnsSchema = v.record(columnNameSchema, columnSchema)
export type Columns = v.InferOutput<typeof columnsSchema>
export type Column = v.InferOutput<typeof columnSchema>

const indexSchema = v.object({
  name: v.string(),
  unique: v.boolean(),
  columns: v.array(v.string()),
})
export type Index = v.InferOutput<typeof indexSchema>

const indicesSchema = v.record(indexNameSchema, indexSchema)
export type Indices = v.InferOutput<typeof indicesSchema>

const foreignKeyConstraintSchema = v.picklist([
  'CASCADE',
  'RESTRICT',
  'SET_NULL',
  'SET_DEFAULT',
  'NO_ACTION',
])

export const primaryKeyConstraintSchema = v.object({
  name: constraintNameSchema,
  columnName: columnNameSchema,
})
export type PrimaryKeyConstraint = v.InferOutput<
  typeof primaryKeyConstraintSchema
>

export const foreignKeyConstraintSchema2 = v.object({
  name: constraintNameSchema,
  columnName: columnNameSchema,
  targetTableName: tableNameSchema,
  targetColumnName: columnNameSchema,
  updateConstraint: foreignKeyConstraintSchema,
  deleteConstraint: foreignKeyConstraintSchema,
})
export type ForeignKeyConstraint2 = v.InferOutput<
  typeof foreignKeyConstraintSchema2
>

export const uniqueKeyConstraintSchema = v.object({
  name: constraintNameSchema,
  columnName: columnNameSchema,
})
export type UniqueKeyConstraint = v.InferOutput<
  typeof uniqueKeyConstraintSchema
>

export const checkConstraintSchema = v.object({
  name: constraintNameSchema,
  detail: v.string(),
})
export type CheckConstraint = v.InferOutput<typeof checkConstraintSchema>

export const constraintSchema = v.union([
  primaryKeyConstraintSchema,
  foreignKeyConstraintSchema2,
  uniqueKeyConstraintSchema,
  checkConstraintSchema,
])
export type Constraint = v.InferOutput<typeof constraintSchema>

const constraintsSchema = v.record(constraintNameSchema, constraintSchema)

export const tableSchema = v.object({
  name: tableNameSchema,
  columns: columnsSchema,
  comment: v.nullable(v.string()),
  indices: indicesSchema,
  constraints: constraintsSchema,
})

export type Table = v.InferOutput<typeof tableSchema>

const cardinalitySchema = v.picklist(['ONE_TO_ONE', 'ONE_TO_MANY'])
export type Cardinality = v.InferOutput<typeof cardinalitySchema>

export type ForeignKeyConstraint = v.InferOutput<
  typeof foreignKeyConstraintSchema
>

export const relationshipSchema = v.object({
  name: relationshipNameSchema,
  primaryTableName: tableNameSchema,
  primaryColumnName: columnNameSchema,
  foreignTableName: tableNameSchema,
  foreignColumnName: columnNameSchema,
  cardinality: cardinalitySchema,
  updateConstraint: foreignKeyConstraintSchema,
  deleteConstraint: foreignKeyConstraintSchema,
})
export type Relationship = v.InferOutput<typeof relationshipSchema>

const tablesSchema = v.record(tableNameSchema, tableSchema)
export type Tables = v.InferOutput<typeof tablesSchema>

const relationshipsSchema = v.record(relationshipNameSchema, relationshipSchema)
export type Relationships = v.InferOutput<typeof relationshipsSchema>

export const dbStructureSchema = v.object({
  tables: tablesSchema,
  relationships: relationshipsSchema,
})

export type DBStructure = v.InferOutput<typeof dbStructureSchema>
