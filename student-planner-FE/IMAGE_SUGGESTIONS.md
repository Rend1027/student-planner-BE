# Image Suggestions for Homepage Story Section

## Current Placeholders

The homepage has **2 image placeholders** in the story section that need to be replaced with actual images.

## Image 1: Student Using Planner on Laptop
**Location:** Left placeholder in story section  
**Suggested Content:**
- A student (diverse representation) sitting at a desk
- Laptop/computer screen visible showing a calendar/planner interface
- Organized workspace with books, notes, or a clean desk
- Natural lighting, professional but approachable
- Should convey organization and productivity

**Image Specs:**
- Aspect Ratio: 4:3
- Recommended Size: 800x600px or 1200x900px
- Format: JPG or PNG
- Style: Modern, clean, matches dark theme aesthetic

**Where to Find:**
- Unsplash: Search "student studying with laptop", "organized desk", "student planner"
- Pexels: Search "student workspace", "study setup"
- FreePik: Academic/education illustrations

---

## Image 2: Mobile App Interface Preview
**Location:** Right placeholder in story section  
**Suggested Content:**
- Smartphone showing the Smart Student Scheduler app interface
- Calendar view or dashboard visible on screen
- Modern phone mockup (iPhone or Android)
- Clean background, product-focused
- Should showcase the app's UI design

**Image Specs:**
- Aspect Ratio: 4:3
- Recommended Size: 800x600px or 1200x900px
- Format: PNG (for transparency if needed) or JPG
- Style: Product mockup, modern, tech-focused

**Where to Find:**
- Create a mockup using: Figma, Canva, or similar tools
- Use phone mockup templates (many free on Figma Community)
- Screenshot your actual app and place in phone frame
- Stock photos: Search "phone app mockup", "mobile calendar app"

---

## Alternative Image Ideas

### Option A: Feature-Focused Images
1. **Calendar/Planner Close-up**
   - Close-up of a well-organized calendar
   - Color-coded events, neat handwriting or digital interface
   - Conveys organization and planning

2. **Student Success Scene**
   - Student checking off completed tasks
   - Satisfied expression, organized workspace
   - Conveys achievement and productivity

### Option B: Abstract/Illustration Style
1. **Minimalist Calendar Illustration**
   - Simple, clean calendar design
   - Matches your app's aesthetic
   - Can be custom-illustrated

2. **Time Management Concept**
   - Abstract representation of time/schedule
   - Modern, geometric design
   - Fits dark theme perfectly

---

## Implementation Notes

### To Replace Placeholders:

1. **Save images** to: `src/assets/images/` or `public/images/`

2. **Update HomePage.jsx:**
   ```jsx
   // Replace placeholder divs with:
   <img 
     src="/images/student-laptop.jpg" 
     alt="Student using Smart Student Scheduler"
     className="story-image"
   />
   ```

3. **Add CSS** (if needed):
   ```css
   .story-image {
     width: 100%;
     height: 100%;
     object-fit: cover;
     border-radius: var(--radius-lg);
   }
   ```

### Image Optimization Tips:
- Compress images before adding (use TinyPNG or similar)
- Use WebP format for better performance (with fallback)
- Consider lazy loading for better page performance
- Ensure images are optimized for web (under 200KB each)

---

## Current Placeholder Behavior

The placeholders:
- Show helpful text about what image should go there
- Have a dashed border to indicate they're placeholders
- Hover effect to show they're interactive
- Will be hidden on mobile screens (< 1024px width)

---

## Quick Start

1. **Find or create images** matching the suggestions above
2. **Save them** to your project's assets folder
3. **Update HomePage.jsx** to use `<img>` tags instead of placeholder divs
4. **Test** on different screen sizes to ensure images look good

Need help implementing? Just ask!

