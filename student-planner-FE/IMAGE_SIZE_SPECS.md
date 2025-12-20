# Image Size Specifications

## 📱 Logo Image

### Display Size
- **Actual Display:** 34px × 34px (circular)
- **Container:** Circular with gradient background

### Source Image Size (Recommended)
- **Optimal:** 200px × 200px (square)
- **Minimum:** 100px × 100px
- **Maximum:** 400px × 400px (for retina displays)
- **Aspect Ratio:** 1:1 (square) - **REQUIRED**
- **Format:** PNG (with transparency) or SVG (recommended)
- **File Size:** Under 100KB

### Why These Sizes?
- 2x retina displays need higher resolution
- Square format ensures it fits the circular container
- Transparent background recommended for best appearance

### Where Used
- Homepage auth card (left side)
- Dashboard header (top navigation)

---

## 🖼️ Story Carousel Images

### Display Area
- **Container Width:** Full right panel (varies by screen size)
- **Content Max-Width:** 800px (centered)
- **Container Height:** 100vh (full viewport height)
- **Padding:** 4rem (64px) on all sides

### Source Image Size (Recommended)

#### Desktop (Primary)
- **Width:** 1200px - 1600px
- **Height:** 800px - 1200px
- **Aspect Ratio:** 16:9 or 4:3 (recommended)
- **Format:** JPG, PNG, or WebP
- **File Size:** Under 500KB per image (optimized)

#### Tablet (1024px and below)
- **Width:** 800px - 1200px
- **Height:** 600px - 900px
- **Same aspect ratio as desktop**

#### Mobile (768px and below)
- **Width:** 600px - 800px
- **Height:** 400px - 600px
- **Same aspect ratio as desktop**

### Recommended Aspect Ratios
1. **16:9 (Widescreen)** - Best for landscape images
   - Example: 1600px × 900px
   - Good for: Screenshots, wide compositions

2. **4:3 (Standard)** - Classic ratio
   - Example: 1200px × 900px
   - Good for: Balanced compositions

3. **1:1 (Square)** - Instagram-style
   - Example: 1200px × 1200px
   - Good for: Focused, centered content

### Image Content Guidelines
- **Focus:** Center your main subject/content
- **Background:** Works well on dark backgrounds (current theme)
- **Text Overlay:** Leave space if you plan to add text
- **Quality:** High resolution for crisp display

### Where Used
- Right side carousel (story section)
- Auto-rotates every 5 seconds
- Manual navigation available

---

## 📋 Quick Reference Table

| Image Type | Display Size | Source Size | Aspect Ratio | Format |
|------------|--------------|-------------|--------------|--------|
| **Logo** | 34×34px | 200×200px | 1:1 (square) | PNG/SVG |
| **Story Image** | Up to 800px wide | 1200-1600px wide | 16:9 or 4:3 | JPG/PNG/WebP |
| **Favicon** | 32×32px | 32×32px or 180×180px | 1:1 (square) | PNG/ICO |

---

## 🎯 Best Practices

### Logo
1. ✅ Use SVG for scalability
2. ✅ Transparent background
3. ✅ Simple design (works at small size)
4. ✅ High contrast for visibility
5. ✅ Test on dark background

### Story Images
1. ✅ Optimize file size (use compression)
2. ✅ Use WebP format for better performance
3. ✅ Provide multiple sizes for responsive design
4. ✅ Ensure images work on dark backgrounds
5. ✅ Keep text readable if included
6. ✅ Center important content

### General Tips
- **Compress images** before uploading (use TinyPNG, ImageOptim, etc.)
- **Test on different screen sizes** to ensure quality
- **Use descriptive filenames** (e.g., `logo-main.png`, `story-classes.jpg`)
- **Consider lazy loading** for story images (already implemented)

---

## 📐 Exact Dimensions by Screen Size

### Logo (Always Same)
- **All Screens:** 34px × 34px display
- **Source:** 200px × 200px recommended

### Story Images

#### Large Desktop (1920px+)
- **Available Width:** ~1420px (1920px - 500px left panel)
- **Content Width:** 800px (max-width, centered)
- **Recommended Source:** 1600px × 900px (16:9)

#### Desktop (1440px)
- **Available Width:** ~940px
- **Content Width:** 800px (max-width, centered)
- **Recommended Source:** 1200px × 675px (16:9)

#### Tablet (1024px)
- **Available Width:** ~524px
- **Content Width:** Full width (responsive)
- **Recommended Source:** 800px × 450px (16:9)

#### Mobile (768px and below)
- **Stacked Layout:** Full width
- **Content Width:** Full width minus padding
- **Recommended Source:** 600px × 338px (16:9)

---

## 🔧 Implementation Notes

### Logo
- File location: `public/logo-placeholder.png`
- Will automatically scale to fit 34×34px container
- Fallback to "SS" text if image missing

### Story Images
- Currently using placeholder divs
- Replace with `<img>` tags when ready
- Images will be centered and responsive
- Auto-fit to container while maintaining aspect ratio

---

## ✅ Checklist

Before adding images:
- [ ] Logo is square (1:1 aspect ratio)
- [ ] Logo has transparent background
- [ ] Logo is optimized (< 100KB)
- [ ] Story images are high quality but optimized (< 500KB each)
- [ ] Story images have appropriate aspect ratio (16:9 or 4:3)
- [ ] All images work on dark backgrounds
- [ ] Images are tested on different screen sizes

