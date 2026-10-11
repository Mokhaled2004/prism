export type CalculationType = "number" | "currency" | "percent" | "string" | "boolean"

export interface CalculationField {
  id: string
  name: string
  type: "integer" | "decimal" | "string" | "date" | "boolean"
  sampleValue: unknown
}

export interface Calculation {
  id: string
  name: string
  description?: string
  datasetId: string
  formula: string
  type: CalculationType
  decimals: number
  /** How many components use this calculation */
  usedBy: number
  createdAt: number
  updatedAt: number
}

/** Available fields for a given dataset (mock for now) */
export interface DatasetFields {
  datasetId: string
  datasetName: string
  fields: CalculationField[]
}

/** Available functions in the function palette */
export interface FormulaFunction {
  name: string
  description: string
  args: string
  category: "math" | "aggregate" | "logic" | "text" | "date"
}