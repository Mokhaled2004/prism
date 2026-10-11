export interface DataSource {
  id: string
  organizationId: string
  name: string
  type: string
  config?: Record<string, unknown> | null
  createdBy: string
  createdAt: Date | string | number
  updatedAt: Date | string | number
}
