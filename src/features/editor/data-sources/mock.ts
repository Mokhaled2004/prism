import type { DataSource, Dataset } from "./types"

export const initialDataSources: DataSource[] = [
  {
    id: "src_pg_1",
    name: "Production DB",
    kind: "postgres",
    status: "connected",
    host: "db.acme.io",
    port: 5432,
    database: "analytics",
    username: "readonly",
    ssl: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    lastTestedAt: Date.now() - 1000 * 60 * 2,
    tableCount: 12,
  },
  {
    id: "src_file_1",
    name: "Q3 Sales.xlsx",
    kind: "file",
    status: "ready",
    fileName: "Q3 Sales.xlsx",
    fileSize: 2_340_000,
    columns: 8,
    rows: 2450,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
  },
]

export const initialDatasets: Dataset[] = [
  {
    id: "ds_1",
    name: "Sales",
    sourceId: "src_pg_1",
    fieldCount: 14,
    rowCount: 2_400_000,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
  },
  {
    id: "ds_2",
    name: "Q3 Transactions",
    sourceId: "src_file_1",
    fieldCount: 8,
    rowCount: 2450,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
]