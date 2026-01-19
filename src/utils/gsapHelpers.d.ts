import { gsap } from 'gsap'

/**
 * Animation easing presets
 */
export const easings: {
  smooth: string
  snappy: string
  elastic: string
  bounce: string
  expo: string
  custom: {
    wrappedEntry: string
    wrappedExit: string
    cardFlip: string
  }
}

/**
 * Animation duration presets (in seconds)
 */
export const durations: {
  fast: number
  normal: number
  slow: number
  verySlow: number
}

/**
 * Stagger configuration for sequential animations
 */
export const staggerPresets: {
  quick: { each: number; from: string }
  normal: { each: number; from: string }
  slow: { each: number; from: string }
  center: { each: number; from: string }
  edges: { each: number; from: string }
}

/**
 * Story-to-Card Transition
 */
export function storyToCardTransition(
  storyElement: HTMLElement,
  cardElement: HTMLElement,
  options?: {
    duration?: number
    ease?: string
    onComplete?: () => void
  },
): gsap.core.Timeline

/**
 * Card entrance animation
 */
export function animateCardEntrance(
  cardElement: HTMLElement,
  options?: {
    duration?: number
    ease?: string
    delay?: number
  },
): gsap.core.Timeline

/**
 * Initialize GSAP with recommended settings
 */
export function initGSAP(): void

/**
 * Create a floating animation
 */
export function floatingAnimation(
  element: HTMLElement,
  options?: {
    y?: number
    duration?: number
    ease?: string
  },
): gsap.core.Tween

/**
 * Create a fade slide animation
 */
export function fadeSlide(
  element: HTMLElement,
  direction?: 'left' | 'right' | 'up' | 'down',
  options?: {
    duration?: number
    distance?: number
  },
): gsap.core.Tween

/**
 * Create a scale fade animation
 */
export function scaleFade(
  element: HTMLElement,
  options?: {
    duration?: number
    scale?: number
  },
): gsap.core.Tween

/**
 * Stagger animation for multiple elements
 */
export function staggerElements(
  elements: HTMLElement[] | NodeList,
  animation: object,
  staggerConfig?: object,
): gsap.core.Timeline
