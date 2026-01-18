# Emoria Birthday Story Engine - Quick Reference

## 🎯 5-Slide Architecture

```
┌─────────────────────────────────────────┐
│  1. BirthdayIntro.vue                   │
│  🎉 Welcome + Name + Particles          │
│  Animation: scale-fade                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. BirthdayMemories.vue                │
│  📊 Stats Grid + Counter Animation      │
│  Animation: fade-slide                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  3. BirthdayMessage.vue                 │
│  💝 Personal Message + Hearts           │
│  Animation: blur-zoom                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  4. BirthdayWish.vue                    │
│  🕯️ Interactive Candle (Tap to Blow)    │
│  Animation: elastic                      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  5. BirthdayOutro.vue                   │
│  🎁 Gift Box + Share Actions            │
│  Animation: morph                        │
└─────────────────────────────────────────┘
```

---

## 📦 File Structure

```
src/
├── components/
│   ├── StoryWrapper.vue              ⭐ Core orchestrator
│   ├── VerticalProgressBar.vue       📊 Progress bars
│   ├── StorySlide.vue                🎬 Base slide
│   └── birthday/
│       ├── BirthdayIntro.vue         1️⃣
│       ├── BirthdayMemories.vue      2️⃣
│       ├── BirthdayMessage.vue       3️⃣
│       ├── BirthdayWish.vue          4️⃣
│       └── BirthdayOutro.vue         5️⃣
├── composables/
│   └── useStoryProgress.js           🎮 State management
├── examples/
│   └── EmoriaBirthdayDemo.vue        🎯 Main demo (9:16)
└── utils/
    └── gsapHelpers.js                ✨ Animation helpers
```

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open http://localhost:3000
```

---

## 🎨 Customization Cheatsheet

### Change Recipient Name
```javascript
// EmoriaBirthdayDemo.vue
const recipientName = ref('Alex');
const birthDate = ref('March 15, 2026');
```

### Update Memories
```javascript
const memories = ref([
  { icon: '🎬', count: '47', label: 'Movies Watched' },
  { icon: '☕', count: '156', label: 'Coffee Dates' },
  { icon: '🎵', count: '2,847', label: 'Songs Shared' },
  { icon: '📸', count: '289', label: 'Photos Taken' }
]);
```

### Change Personal Message
```javascript
const personalMessage = ref(
  'Your custom heartfelt message here...'
);
```

### Adjust Timing
```vue
<StoryWrapper
  :slide-duration="6"        <!-- Seconds per slide -->
  :animation-duration="0.8"  <!-- Transition speed -->
/>
```

---

## 🎬 Animation Types

```javascript
const slides = ref([
  { id: 'intro', animationType: 'scale-fade' },    // Zoom in
  { id: 'memories', animationType: 'fade-slide' }, // Slide + fade
  { id: 'message', animationType: 'blur-zoom' },   // Cinematic blur
  { id: 'wish', animationType: 'elastic' },        // Bouncy
  { id: 'outro', animationType: 'morph' }          // Shape morph
]);
```

**Available Types:**
- `fade-slide` - Directional fade
- `scale-fade` - Zoom effect
- `blur-zoom` - Cinematic blur
- `elastic` - Bouncy entrance
- `flip` - 3D card flip
- `morph` - Shape transformation
- `rotate-fade` - 3D rotation
- `split-reveal` - Center reveal

---

## 📱 Aspect Ratio (9:16)

```css
/* Automatic on mobile: Full screen */
@media (max-width: 768px) {
  .story-frame {
    width: 100vw;
    height: 100vh;
  }
}

/* Desktop: Centered card */
@media (min-width: 769px) {
  .story-frame {
    max-width: 450px;
    aspect-ratio: 9 / 16;
  }
}
```

---

## 🎯 Event Handling

```vue
<StoryWrapper
  @slide-change="handleSlideChange"
  @story-complete="handleComplete"
  @pause="handlePause"
  @resume="handleResume"
>
```

```javascript
const handleSlideChange = ({ index, slide, direction }) => {
  console.log(`Slide ${index}: ${slide.id} (${direction})`);
  
  // Track analytics
  analytics.track('slide_view', { index, name: slide.id });
};

const handleComplete = () => {
  console.log('Story completed!');
  // Show CTA, redirect, etc.
};
```

---

## 🎮 Programmatic Control

```javascript
const storyRef = ref(null);

// Methods
storyRef.value.nextSlide();      // Go to next
storyRef.value.previousSlide();  // Go back
storyRef.value.goToSlide(3);     // Jump to index
storyRef.value.pause();          // Pause progress
storyRef.value.resume();         // Resume
storyRef.value.reset();          // Start over

// State
storyRef.value.currentSlide      // Current index
storyRef.value.progress          // 0-100
storyRef.value.isPaused          // Boolean
```

---

## 🎨 Color Themes

### Slide Gradients
```css
/* Intro */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Memories */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Message */
background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);

/* Wish */
background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);

/* Outro */
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
```

---

## ⚡ Performance Tips

1. **Use GPU acceleration**
   ```css
   transform: translateZ(0);
   will-change: transform, opacity;
   ```

2. **Lazy load slides**
   ```javascript
   watch(isActive, (active) => {
     if (active) playAnimation();
   });
   ```

3. **Cleanup animations**
   ```javascript
   onUnmounted(() => {
     gsap.killTweensOf('*');
   });
   ```

4. **Optimize images**
   - Use WebP format
   - Max width: 1080px
   - Compress to ~100KB

---

## 🐛 Common Issues

### Issue: Progress bar not animating
```javascript
// Ensure startProgress() is called
onMounted(() => {
  if (autoStart) {
    startProgress();
  }
});
```

### Issue: Slides not transitioning
```javascript
// Check isTransitioning guard
const nextSlide = () => {
  if (isTransitioning.value) return;
  // ... rest of code
};
```

### Issue: Mobile aspect ratio broken
```css
/* Use dvh instead of vh */
height: 100dvh;  /* NOT 100vh */
```

---

## 📊 Analytics Integration

### Google Analytics
```javascript
const trackSlide = ({ index, slide }) => {
  gtag('event', 'slide_view', {
    slide_name: slide.id,
    slide_index: index
  });
};
```

### Custom Tracking
```javascript
const trackEngagement = ({ index, timeSpent }) => {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({
      event: 'birthday_slide_view',
      slide: index,
      duration: timeSpent
    })
  });
};
```

---

## 🎁 Export Options

### Share Image
```javascript
const captureStory = async () => {
  const html2canvas = await import('html2canvas');
  const canvas = await html2canvas.default(storyRef.value);
  const image = canvas.toDataURL('image/png');
  
  // Download or share
  downloadImage(image, 'birthday-story.png');
};
```

### Share Link
```javascript
const shareStory = () => {
  if (navigator.share) {
    navigator.share({
      title: `${recipientName.value}'s Birthday 2026`,
      text: 'Check out this birthday story!',
      url: window.location.href
    });
  }
};
```

---

## 🔗 Useful Links

- [GSAP Docs](https://greensock.com/docs/v3/GSAP)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Full Documentation](./BIRTHDAY_ENGINE_DOCS.md)

---

**Emoria** | Crafted with 💝
