import { Ref } from 'vue'

export interface SlideConfig {
  requiresAction?: boolean
  hasInteraction?: boolean
  duration?: number
  [key: string]: unknown
}

export interface UseStoryProgressOptions {
  totalSlides?: number
  duration?: number
  onSlideChange?: (index: number, direction: string) => void
  onComplete?: () => void
  getSlideConfig?: (index: number) => SlideConfig
}

export interface UseStoryProgressReturn {
  currentSlide: Ref<number>
  progress: Ref<number>
  isPaused: Ref<boolean>
  isTransitioning: Ref<boolean>
  isFirstSlide: Ref<boolean>
  isLastSlide: Ref<boolean>
  waitingForAction: Ref<boolean>
  startProgress: () => void
  nextSlide: () => void
  previousSlide: () => void
  goToSlide: (index: number) => void
  pause: () => void
  resume: () => void
  togglePause: () => void
  reset: () => void
  completeAction: () => void
}

export function useStoryProgress(options?: UseStoryProgressOptions): UseStoryProgressReturn
