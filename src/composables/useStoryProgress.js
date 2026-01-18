import { ref, computed, onUnmounted } from 'vue';
import { gsap } from 'gsap';

/**
 * useStoryProgress - Core composable for managing story slide progression
 * Handles timing, auto-advance, pause/resume, and progress tracking
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.totalSlides - Total number of slides
 * @param {number} options.duration - Duration per slide in seconds (default: 5)
 * @param {Function} options.onSlideChange - Callback when slide changes
 * @param {Function} options.onComplete - Callback when all slides complete
 * @returns {Object} Story progress state and controls
 */
export function useStoryProgress(options = {}) {
  const {
    totalSlides = 0,
    duration = 5,
    onSlideChange = () => {},
    onComplete = () => {}
  } = options;

  // State
  const currentSlide = ref(0);
  const isPaused = ref(false);
  const isTransitioning = ref(false);
  const progress = ref(0);

  // Timeline for progress animation
  let progressTimeline = null;
  let pausedProgress = 0;

  /**
   * Initialize or restart progress animation for current slide
   */
  const startProgress = () => {
    if (progressTimeline) {
      progressTimeline.kill();
    }

    progressTimeline = gsap.timeline({
      onUpdate: () => {
        progress.value = progressTimeline.progress() * 100;
      },
      onComplete: () => {
        if (!isPaused.value && currentSlide.value < totalSlides - 1) {
          nextSlide();
        } else if (currentSlide.value === totalSlides - 1) {
          onComplete();
        }
      }
    });

    progressTimeline.to(progress, {
      value: 100,
      duration: duration,
      ease: 'none'
    });

    if (isPaused.value) {
      progressTimeline.pause();
    }
  };

  /**
   * Navigate to next slide with transition
   */
  const nextSlide = async () => {
    if (isTransitioning.value || currentSlide.value >= totalSlides - 1) {
      return;
    }

    isTransitioning.value = true;
    progress.value = 0;

    // Small delay for transition smoothness
    await gsap.to({}, { duration: 0.3 });

    currentSlide.value++;
    onSlideChange(currentSlide.value, 'next');

    // Wait for slide transition to start before starting progress
    await gsap.to({}, { duration: 0.1 });
    
    isTransitioning.value = false;
    startProgress();
  };

  /**
   * Navigate to previous slide with transition
   */
  const previousSlide = async () => {
    if (isTransitioning.value || currentSlide.value <= 0) {
      return;
    }

    isTransitioning.value = true;
    progress.value = 0;

    await gsap.to({}, { duration: 0.3 });

    currentSlide.value--;
    onSlideChange(currentSlide.value, 'previous');

    await gsap.to({}, { duration: 0.1 });
    
    isTransitioning.value = false;
    startProgress();
  };

  /**
   * Jump to specific slide index
   */
  const goToSlide = async (index) => {
    if (
      isTransitioning.value || 
      index < 0 || 
      index >= totalSlides || 
      index === currentSlide.value
    ) {
      return;
    }

    isTransitioning.value = true;
    progress.value = 0;

    const direction = index > currentSlide.value ? 'next' : 'previous';

    await gsap.to({}, { duration: 0.3 });

    currentSlide.value = index;
    onSlideChange(currentSlide.value, direction);

    await gsap.to({}, { duration: 0.1 });
    
    isTransitioning.value = false;
    startProgress();
  };

  /**
   * Pause progress animation
   */
  const pause = () => {
    if (!isPaused.value && progressTimeline) {
      isPaused.value = true;
      pausedProgress = progressTimeline.progress();
      progressTimeline.pause();
    }
  };

  /**
   * Resume progress animation
   */
  const resume = () => {
    if (isPaused.value && progressTimeline) {
      isPaused.value = false;
      progressTimeline.resume();
    }
  };

  /**
   * Toggle pause/resume
   */
  const togglePause = () => {
    if (isPaused.value) {
      resume();
    } else {
      pause();
    }
  };

  /**
   * Reset to first slide
   */
  const reset = () => {
    if (progressTimeline) {
      progressTimeline.kill();
    }
    currentSlide.value = 0;
    progress.value = 0;
    isPaused.value = false;
    isTransitioning.value = false;
    startProgress();
  };

  /**
   * Cleanup on unmount
   */
  const cleanup = () => {
    if (progressTimeline) {
      progressTimeline.kill();
      progressTimeline = null;
    }
  };

  // Computed properties
  const isFirstSlide = computed(() => currentSlide.value === 0);
  const isLastSlide = computed(() => currentSlide.value === totalSlides - 1);
  const canGoNext = computed(() => !isLastSlide.value && !isTransitioning.value);
  const canGoPrevious = computed(() => !isFirstSlide.value && !isTransitioning.value);

  // Auto cleanup
  onUnmounted(cleanup);

  return {
    // State
    currentSlide,
    progress,
    isPaused,
    isTransitioning,
    
    // Computed
    isFirstSlide,
    isLastSlide,
    canGoNext,
    canGoPrevious,
    
    // Methods
    startProgress,
    nextSlide,
    previousSlide,
    goToSlide,
    pause,
    resume,
    togglePause,
    reset,
    cleanup
  };
}
