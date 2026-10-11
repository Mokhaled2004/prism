import type { Calculation, DatasetFields, FormulaFunction } from "./types"

export const mockCalculations: Calculation[] = [
  {
    id: "calc_1",
    name: "Revenue",
    description: "Total revenue from quantity × unit price",
    datasetId: "ds_1",
    formula: "{quantity} * {unit_price}",
    type: "currency",
    decimals: 2,
    usedBy: 8,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "calc_2",
    name: "Profit",
    description: "Revenue minus cost",
    datasetId: "ds_1",
    formula: "({quantity} * {unit_price}) - {cost}",
    type: "currency",
    decimals: 2,
    usedBy: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "calc_3",
    name: "Profit Margin",
    description: "Profit as a percentage of revenue",
    datasetId: "ds_1",
    formula: "(({quantity} * {unit_price}) - {cost}) / ({quantity} * {unit_price}) * 100",
    type: "percent",
    decimals: 1,
    usedBy: 3,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
]

export const mockDatasetFields: DatasetFields[] = [
  {
    datasetId: "ds_1",
    datasetName: "Sales",
    fields: [
      { id: "f_quantity", name: "quantity", type: "integer", sampleValue: 24 },
      { id: "f_unit_price", name: "unit_price", type: "decimal", sampleValue: 12.5 },
      { id: "f_cost", name: "cost", type: "decimal", sampleValue: 8.2 },
      { id: "f_discount", name: "discount", type: "decimal", sampleValue: 0.1 },
      { id: "f_category", name: "category", type: "string", sampleValue: "Coffee" },
      { id: "f_region", name: "region", type: "string", sampleValue: "Cairo" },
      { id: "f_date", name: "date", type: "date", sampleValue: "2024-03-15" },
    ],
  },
  {
    datasetId: "ds_2",
    datasetName: "Q3 Transactions",
    fields: [
      { id: "f_amount", name: "amount", type: "decimal", sampleValue: 340.0 },
      { id: "f_fee", name: "fee", type: "decimal", sampleValue: 4.5 },
      { id: "f_product", name: "product", type: "string", sampleValue: "Green Tea" },
      { id: "f_merchant", name: "merchant", type: "string", sampleValue: "Acme Retail" },
    ],
  },
]

export const formulaFunctions: FormulaFunction[] = [
  // Math
  { name: "ABS", description: "Absolute value", args: "x", category: "math" },
  { name: "ROUND", description: "Round to N decimals", args: "x, digits", category: "math" },
  { name: "FLOOR", description: "Round down", args: "x", category: "math" },
  { name: "CEIL", description: "Round up", args: "x", category: "math" },
  { name: "POWER", description: "x raised to y", args: "x, y", category: "math" },

  // Aggregate
  { name: "SUM", description: "Sum of values", args: "x", category: "aggregate" },
  { name: "AVG", description: "Average", args: "x", category: "aggregate" },
  { name: "MIN", description: "Smallest value", args: "x", category: "aggregate" },
  { name: "MAX", description: "Largest value", args: "x", category: "aggregate" },
  { name: "COUNT", description: "Count of values", args: "x", category: "aggregate" },
  { name: "COUNT_DISTINCT", description: "Count of unique values", args: "x", category: "aggregate" },

  // Logic
  { name: "IF", description: "Conditional value", args: "condition, then, else", category: "logic" },
  { name: "CASE", description: "Multi-branch conditional", args: "when1, then1, ... , else", category: "logic" },
  { name: "AND", description: "Both conditions true", args: "a, b", category: "logic" },
  { name: "OR", description: "Either condition true", args: "a, b", category: "logic" },
  { name: "NOT", description: "Invert boolean", args: "a", category: "logic" },
  { name: "IS_NULL", description: "Value is null", args: "x", category: "logic" },

  // Text
  { name: "CONCAT", description: "Join strings", args: "a, b", category: "text" },
  { name: "UPPER", description: "Uppercase text", args: "x", category: "text" },
  { name: "LOWER", description: "Lowercase text", args: "x", category: "text" },
  { name: "LENGTH", description: "Length of text", args: "x", category: "text" },

  // Date
  { name: "YEAR", description: "Year from date", args: "d", category: "date" },
  { name: "MONTH", description: "Month from date", args: "d", category: "date" },
  { name: "DAY", description: "Day from date", args: "d", category: "date" },
  { name: "DAYS_BETWEEN", description: "Days between two dates", args: "d1, d2", category: "date" },
  { name: "DATE_TRUNC", description: "Truncate to unit", args: "unit, d", category: "date" },
]