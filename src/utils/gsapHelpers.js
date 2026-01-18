import { gsap } from 'gsap';

/**
 * GSAP Animation Utilities for Spotify Wrapped-style transitions
 * Reusable animation helpers and presets
 */

/**
 * Animation easing presets
 */
export const easings = {
  smooth: 'power2.out',
  snappy: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',
  bounce: 'bounce.out',
  expo: 'expo.out',
  custom: {
    wrappedEntry: 'power3.out',
    wrappedExit: 'power2.in',
    cardFlip: 'back.out(1.5)'
  }
};

/**
 * Animation duration presets (in seconds)
 */
export const durations = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.0,
  verySlow: 1.5
};

/**
 * Stagger configuration for sequential animations
 */
export const staggerPresets = {
  quick: { each: 0.05, from: 'start' },
  normal: { each: 0.1, from: 'start' },
  slow: { each: 0.15, from: 'start' },
  center: { each: 0.1, from: 'center' },
  edges: { each: 0.1, from: 'edges' }
};

/**
 * Story-to-Card Transition
 * Specialized transition for moving from story slides to shareable card
 * 
 * @param {HTMLElement} storyElement - The outgoing story element
 * @param {HTMLElement} cardElement - The incoming card element
 * @param {Object} options - Animation options
 * @returns {GSAPTimeline} The animation timeline
 */
export function storyToCardTransition(storyElement, cardElement, options = {}) {
  const {
    duration = 1.5,
    ease = easings.custom.cardFlip,
    onComplete = () => {}
  } = options;

  const tl = gsap.timeline({ onComplete });

  // Phase 1: Exit story with shrink and fade
  tl.to(storyElement, {
    scale: 0.85,
    opacity: 0,
    filter: 'blur(20px)',
    duration: duration * 0.4,
    ease: 'power2.in'
  });

  // Phase 2: Enter card with dramatic 3D flip
  tl.fromTo(cardElement,
    {
      opacity: 0,
      scale: 0.3,
      rotationY: -180,
      rotationX: 20,
      z: -500,
      transformOrigin: '50% 50%'
    },
    {
      opacity: 1,
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      z: 0,
      duration: duration * 0.6,
      ease: ease
    },
    `-=${duration * 0.1}` // Slight overlap
  );

  return tl;
}

/**
 * Card-to-Story Transition
 * Reverse transition from shareable card back to story
 * 
 * @param {HTMLElement} cardElement - The outgoing card element
 * @param {HTMLElement} storyElement - The incoming story element
 * @param {Object} options - Animation options
 * @returns {GSAPTimeline} The animation timeline
 */
export function cardToStoryTransition(cardElement, storyElement, options = {}) {
  const {
    duration = 1.0,
    ease = easings.custom.wrappedExit,
    onComplete = () => {}
  } = options;

  const tl = gsap.timeline({ onComplete });

  // Phase 1: Exit card with flip and shrink
  tl.to(cardElement, {
    scale: 0.5,
    opacity: 0,
    rotationY: 90,
    z: -300,
    duration: duration * 0.5,
    ease: 'power2.in'
  });

  // Phase 2: Enter story with zoom in
  tl.fromTo(storyElement,
    {
      opacity: 0,
      scale: 1.2,
      filter: 'blur(10px)'
    },
    {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: duration * 0.5,
      ease: ease
    },
    `-=${duration * 0.1}`
  );

  return tl;
}

/**
 * Fade Slide Transition
 * Standard fade with directional slide
 */
export function fadeSlideTransition(element, direction = 'next', options = {}) {
  const {
    duration = 0.6,
    distance = 100,
    ease = easings.smooth
  } = options;

  const offset = direction === 'next' ? distance : -distance;

  return gsap.fromTo(element,
    {
      opacity: 0,
      x: offset,
      scale: 0.95
    },
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration,
      ease
    }
  );
}

/**
 * Scale Fade Transition
 * Zoom in/out with fade
 */
export function scaleFadeTransition(element, type = 'in', options = {}) {
  const {
    duration = 0.7,
    ease = easings.snappy
  } = options;

  if (type === 'in') {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.7,
        rotationY: 15
      },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration,
        ease
      }
    );
  } else {
    return gsap.to(element, {
      opacity: 0,
      scale: 1.1,
      duration: duration * 0.7,
      ease: 'power2.in'
    });
  }
}

/**
 * Blur Zoom Transition
 * Cinematic blur with zoom effect
 */
export function blurZoomTransition(element, type = 'in', options = {}) {
  const {
    duration = 0.8,
    ease = easings.expo
  } = options;

  if (type === 'in') {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scale: 1.3,
        filter: 'blur(20px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration,
        ease
      }
    );
  } else {
    return gsap.to(element, {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(15px)',
      duration: duration * 0.6,
      ease: 'power2.in'
    });
  }
}

/**
 * Elastic Bounce Transition
 * Playful elastic entrance
 */
export function elasticBounceTransition(element, direction = 'up', options = {}) {
  const {
    duration = 1.2,
    ease = easings.elastic
  } = options;

  const offset = direction === 'up' ? 100 : -100;

  return gsap.fromTo(element,
    {
      opacity: 0,
      y: offset,
      scale: 0.7
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      ease
    }
  );
}

/**
 * Split Reveal Transition
 * Reveal from center or edges
 */
export function splitRevealTransition(element, from = 'center', options = {}) {
  const {
    duration = 0.8,
    ease = easings.expo
  } = options;

  const clipPaths = {
    center: {
      from: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
    },
    horizontal: {
      from: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
      to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
    }
  };

  const clips = clipPaths[from] || clipPaths.center;

  return gsap.fromTo(element,
    {
      opacity: 0,
      clipPath: clips.from,
      scale: 1.1
    },
    {
      opacity: 1,
      clipPath: clips.to,
      scale: 1,
      duration,
      ease
    }
  );
}

/**
 * Stagger Children Animation
 * Animate multiple children in sequence
 */
export function staggerChildren(parentElement, options = {}) {
  const {
    selector = '.item',
    stagger = staggerPresets.normal,
    duration = 0.6,
    ease = easings.smooth,
    fromVars = { opacity: 0, y: 30 },
    toVars = { opacity: 1, y: 0 }
  } = options;

  const children = parentElement.querySelectorAll(selector);

  return gsap.fromTo(children,
    fromVars,
    {
      ...toVars,
      duration,
      stagger,
      ease
    }
  );
}

/**
 * Number Counter Animation
 * Animate number from 0 to target value
 */
export function animateNumber(element, targetValue, options = {}) {
  const {
    duration = 2,
    ease = easings.expo,
    decimals = 0,
    onUpdate = null
  } = options;

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease,
    onUpdate: () => {
      const displayValue = obj.value.toFixed(decimals);
      element.textContent = displayValue.toLocaleString();
      if (onUpdate) onUpdate(obj.value);
    }
  });
}

/**
 * Progress Bar Animation
 * Animate progress bar fill
 */
export function animateProgressBar(element, progress, options = {}) {
  const {
    duration = 0.8,
    ease = easings.smooth,
    direction = 'horizontal'
  } = options;

  const property = direction === 'horizontal' ? 'scaleX' : 'scaleY';

  return gsap.to(element, {
    [property]: progress / 100,
    duration,
    ease
  });
}

/**
 * Confetti Burst Animation
 * Create and animate confetti particles
 */
export function confettiBurst(container, options = {}) {
  const {
    count = 50,
    colors = ['#1DB954', '#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'],
    duration = 3,
    spread = 100
  } = options;

  const tl = gsap.timeline();
  const confettiElements = [];

  // Create confetti elements
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = '50%';
    confetti.style.top = '50%';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    container.appendChild(confetti);
    confettiElements.push(confetti);

    // Animate each confetti
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 50 + Math.random() * spread;
    const x = Math.cos(angle) * velocity;
    const y = Math.sin(angle) * velocity;

    tl.to(confetti, {
      x,
      y,
      rotation: Math.random() * 720,
      opacity: 0,
      duration: duration + Math.random(),
      ease: 'power2.out',
      onComplete: () => confetti.remove()
    }, 0);
  }

  return tl;
}

/**
 * Parallax Scroll Effect
 * Create depth with parallax scrolling
 */
export function parallaxScroll(elements, scrollTrigger, options = {}) {
  const {
    speed = 0.5,
    ease = 'none'
  } = options;

  return gsap.to(elements, {
    y: (i, el) => -scrollTrigger * speed * (i + 1),
    ease
  });
}

/**
 * Floating Animation
 * Subtle floating effect for elements
 */
export function floatingAnimation(element, options = {}) {
  const {
    distance = 10,
    duration = 2,
    ease = 'sine.inOut'
  } = options;

  return gsap.to(element, {
    y: -distance,
    duration,
    ease,
    repeat: -1,
    yoyo: true
  });
}

/**
 * Glitch Effect
 * Create digital glitch effect
 */
export function glitchEffect(element, options = {}) {
  const {
    duration = 0.5,
    intensity = 20
  } = options;

  const tl = gsap.timeline();

  for (let i = 0; i < 5; i++) {
    tl.to(element, {
      x: Math.random() * intensity - intensity / 2,
      y: Math.random() * intensity - intensity / 2,
      skewX: Math.random() * intensity - intensity / 2,
      duration: duration / 5,
      ease: 'none'
    });
  }

  tl.to(element, {
    x: 0,
    y: 0,
    skewX: 0,
    duration: duration / 5,
    ease: easings.smooth
  });

  return tl;
}

/**
 * Preload GSAP optimizations
 * Call this on app initialization for better performance
 */
export function initGSAP() {
  // Set default overwrite mode
  gsap.defaults({
    overwrite: 'auto'
  });

  // Enable GPU acceleration for transforms
  gsap.set('html', { force3D: true });

  // Register commonly used properties for better performance
  gsap.registerEffect({
    name: 'fadeSlide',
    effect: (targets, config) => fadeSlideTransition(targets[0], config.direction, config),
    defaults: { direction: 'next' },
    extendTimeline: true
  });

  console.log('GSAP initialized with performance optimizations');
}

/**
 * Kill all active GSAP animations
 * Useful for cleanup
 */
export function killAllAnimations() {
  gsap.killTweensOf('*');
}

export default {
  easings,
  durations,
  staggerPresets,
  storyToCardTransition,
  cardToStoryTransition,
  fadeSlideTransition,
  scaleFadeTransition,
  blurZoomTransition,
  elasticBounceTransition,
  splitRevealTransition,
  staggerChildren,
  animateNumber,
  animateProgressBar,
  confettiBurst,
  parallaxScroll,
  floatingAnimation,
  glitchEffect,
  initGSAP,
  killAllAnimations
};
