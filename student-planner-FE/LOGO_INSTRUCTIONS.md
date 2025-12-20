# Logo and Favicon Setup Instructions

## Logo Files Needed

### 1. Main Logo Image
**File:** `public/logo-placeholder.png` (or `.svg`, `.jpg`, `.webp`)

**Specifications:**
- **Recommended Size:** 200x200px (square)
- **Format:** PNG (with transparency) or SVG (recommended)
- **Aspect Ratio:** 1:1 (square)
- **Background:** Transparent preferred
- **File Size:** Under 100KB for best performance

**Where it's used:**
- Homepage auth card (34x34px display size)
- Dashboard header (34x34px display size)

### 2. Favicon
**File:** `public/favicon-placeholder.png` (or `.ico`)

**Specifications:**
- **Recommended Sizes:** 
  - 32x32px (standard)
  - 16x16px (small)
  - 180x180px (Apple touch icon)
- **Format:** PNG or ICO
- **File Size:** Under 50KB

**Where it's used:**
- Browser tab icon
- Bookmarks
- Mobile home screen (when saved)

## How to Add Your Logo

### Step 1: Prepare Your Logo
1. Create or export your logo as a square image
2. Ensure it has a transparent background (if using PNG)
3. Optimize the image size

### Step 2: Add Logo Files
1. Place your main logo in: `public/logo-placeholder.png`
   - You can rename it to `logo.png` if you prefer
   - Update the `src` path in the code if you rename it

2. Place your favicon in: `public/favicon-placeholder.png`
   - You can rename it to `favicon.png` if you prefer
   - Update the `href` path in `index.html` if you rename it

### Step 3: Update File Paths (if renamed)

**In `src/pages/HomePage.jsx`:**
```jsx
<img src="/logo.png" ... />  // Change from logo-placeholder.png
```

**In `src/components/layout/Header.jsx`:**
```jsx
<img src="/logo.png" ... />  // Change from logo-placeholder.png
```

**In `index.html`:**
```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

## Current Fallback Behavior

If the logo image doesn't exist:
- The image will hide automatically
- A fallback placeholder with "SS" text will show
- The gradient background will remain visible

## Logo Display Sizes

- **Homepage Auth Card:** 34x34px (circular)
- **Dashboard Header:** 34x34px (circular)
- Both are displayed in a circular container with gradient background

## Tips

1. **Use SVG** for best quality at any size
2. **Test on different backgrounds** - your logo should work on dark backgrounds
3. **Keep it simple** - small logos work best at 34px size
4. **Consider a monochrome version** for better visibility

## Quick Test

1. Add your logo file to `public/logo-placeholder.png`
2. Add your favicon to `public/favicon-placeholder.png`
3. Refresh the page
4. The logo should appear automatically!

If you see the "SS" placeholder, check:
- File name matches exactly
- File is in the `public` folder
- File format is supported (PNG, SVG, JPG, WEBP)

