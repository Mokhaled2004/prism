export type Easing =
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "linear"

export type EntranceAnimation = "none" | "fadeIn" | "slideUp" | "scaleIn"

export type DataChangeAnimation = "none" | "fadeUpdate" | "slideUpdate"

export interface AnimationConfig {
  enabled: boolean
  /** Duration in milliseconds */
  duration: number
  easing: Easing
  /** Delay before the animation starts, in ms */
  delay: number
  entrance: EntranceAnimation
  onDataChange: DataChangeAnimation
}