export interface Dashboard {
  id: string
  organizationId: string
  name: string
  slug: string
  description?: string | null
  config?: Record<string, unknown> | null
  isPublished: boolean
  createdBy?: string
  createdAt?: Date | string | number
  updatedAt: Date | string | number
}
