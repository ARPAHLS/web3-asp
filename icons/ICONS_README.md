# H3 Aspis Icons

This directory should contain the extension icons in the following sizes:

## Required Icon Files

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon32.png` - 32x32 pixels (Windows)
- `icon48.png` - 48x48 pixels (extension management)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Design Guidelines

### Color Palette
- **Primary**: Light pastel lilac (#E6E6FA)
- **Secondary**: Plum/lavender (#DDA0DD)
- **Accent**: White (#FFFFFF)

### Design Elements
- Shield icon (🛡️) as main symbol
- Minimal, modern design
- Gradient from lilac to white
- Optional: Web3 hexagon pattern in background
- Clean, readable at all sizes

## Creating Icons

### Option 1: Online Tools
- Use Canva, Figma, or similar design tools
- Export as PNG with transparent background
- Ensure sharp edges at small sizes

### Option 2: SVG Template
Create an SVG and export to different sizes:

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E6E6FA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#DDA0DD;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Shield shape -->
  <path d="M64 10 L100 30 L100 70 L64 118 L28 70 L28 30 Z" 
        fill="url(#grad)" stroke="#fff" stroke-width="2"/>
  
  <!-- H3 text -->
  <text x="64" y="75" font-family="Arial" font-size="32" 
        font-weight="bold" fill="#fff" text-anchor="middle">H3</text>
</svg>
```

### Option 3: AI Image Generator
- Use DALL-E, Midjourney, or similar
- Prompt: "minimalist shield icon, pastel lilac and white, modern, flat design, Web3 security, transparent background"

## Placeholder Icons

Until final icons are ready, you can use:
1. Unicode shield emoji (🛡️) rendered as image
2. Simple colored squares with gradient
3. Text-based icons with "H3" on colored background

## Installation

1. Create your icons using the guidelines above
2. Save them in this directory
3. Ensure filenames match exactly:
   - icon16.png
   - icon32.png
   - icon48.png
   - icon128.png
4. Reload the extension in Chrome

## Testing

After adding icons:
1. Check toolbar - should show icon16.png
2. Check chrome://extensions - should show icon48.png
3. Verify all sizes look crisp and clear
4. Test on light and dark themes

