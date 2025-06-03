# Demo Videos Directory

## 📹 Video Setup Instructions

### Required Files:
1. **Main Video File**: `ai-workflow-studio-demo.mp4` or `ai-workflow-studio-demo.webm`
2. **Poster Image**: `poster.jpg` (1920x1080 recommended)
3. **Subtitles** (optional): 
   - `subtitles-ro.vtt` (Romanian - already created)
   - `subtitles-en.vtt` (English - already created)

### 🎬 To Add Your Custom Video:

1. **Add your video file** to this directory with one of these names:
   - `ai-workflow-studio-demo.mp4` (recommended for compatibility)
   - `ai-workflow-studio-demo.webm` (smaller file size)

2. **Add a poster image** (optional but recommended):
   - Name it `poster.jpg`
   - Recommended size: 1920x1080
   - This will show before the video plays

3. **Update the component** (if needed):
   - Edit `src/components/landing/DemoVideoSection.tsx`
   - Remove the `hidden` class from the video element (line 101)
   - Hide or remove the placeholder div (lines 86-96)

### 🔧 Quick Activation Steps:

Once you add your video file, update the DemoVideoSection component:

```tsx
// In src/components/landing/DemoVideoSection.tsx
// Change this line:
className="w-full aspect-video object-cover hidden"
// To this:
className="w-full aspect-video object-cover"

// And hide the placeholder by adding 'hidden' class:
<div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center rounded-lg hidden">
```

### 📝 Subtitle Format:
The subtitle files are already created in WebVTT format. If you want to update them, follow this format:

```vtt
WEBVTT

1
00:00:00.000 --> 00:00:04.000
Your subtitle text here

2
00:00:04.000 --> 00:00:08.000
Next subtitle text
```

### 🎯 Video Recommendations:
- **Duration**: 2-3 minutes optimal
- **Resolution**: 1920x1080 (Full HD)
- **Format**: MP4 (H.264) for best compatibility
- **File Size**: Under 50MB for fast loading
- **Content**: Showcase the unique AI tutorial system, gamification, and competitive advantages

### 🚀 Current Status:
- ✅ Subtitle files created (Romanian & English)
- ✅ Video player component ready
- ✅ Professional styling implemented
- ⏳ Waiting for your custom video file

The landing page is ready to showcase your video as soon as you add it!
