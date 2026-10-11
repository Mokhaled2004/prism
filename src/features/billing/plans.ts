export const PLAN_DEFINITIONS = {
  free: {
    name: "Free",
    price: 0,
    maxDashboards: 3,
    maxDatasources: 1,
    maxSeats: 2,
  },
  pro: {
    name: "Pro",
    price: 499,
    maxDashboards: 25,
    maxDatasources: 5,
    maxSeats: 10,
  },
  business: {
    name: "Business",
    price: 1999,
    maxDashboards: Infinity,
    maxDatasources: Infinity,
    maxSeats: 50,
  },
  enterprise: {
    name: "Enterprise",
    price: null,
    maxDashboards: Infinity,
    maxDatasources: Infinity,
    maxSeats: Infinity,
  },
} as const

export type PlanId = keyof typeof PLAN_DEFINITIONS
