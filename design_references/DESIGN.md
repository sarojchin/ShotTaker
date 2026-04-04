# Design System Strategy: The Precision Lens

### 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Technical Gallerist."** 

To appeal to the disciplined eye of a photographer, the UI must mirror the hardware they respect: the tactile precision of a Leica, the clarity of a high-end prime lens, and the sophisticated layout of an archival photography monograph. We move beyond "standard" app design by embracing the tension between technical metadata and artistic expression. 

This system breaks the "template" look by using intentional asymmetry—placing technical habit data in tight, disciplined clusters against expansive, airy canvases for user imagery. It is a stage where the interface recedes, and the craft of photography takes center stage.

---

### 2. Colors & Tonal Architecture
The palette utilizes a sophisticated foundation of charcoals and crisp whites, punctuated by a "Golden Hour" orange (`primary`) and a "Technical Blue" (`tertiary`).

*   **The "No-Line" Rule:** To maintain a high-end feel, designers are prohibited from using 1px solid borders to define sections. Boundaries must be created through tonal shifts. A section should be defined by transitioning from `surface` (#fcf9f8) to `surface_container_low` (#f6f3f2). This creates a "milled" look rather than a "drawn" look.
*   **Surface Hierarchy & Nesting:** Treat the UI as a physical assembly.
    *   **Base:** `surface` (#fcf9f8) for the main canvas.
    *   **Sub-sections:** `surface_container` (#f0edec) for content grouping.
    *   **Elevated Elements:** `surface_container_lowest` (#ffffff) for cards or active modules to create a "lifted" paper effect.
*   **The "Glass & Gradient" Rule:** For floating navigation or modal overlays, use a Glassmorphism approach. Utilize `surface` with 80% opacity and a `backdrop-filter: blur(20px)`. Main CTAs should use a subtle linear gradient from `primary` (#8b500a) to `primary_container` (#d48c45) to add "soul" and mimic the warmth of natural light.

---

### 3. Typography: The Editorial Scale
We use **Inter** as our typographic workhorse. It provides the modernist, neutral clarity required for a technical tool.

*   **Display & Headlines:** Use `display-lg` (3.5rem) and `headline-lg` (2rem) with tight letter-spacing (-0.02em) for habit streaks or gallery titles. This conveys an authoritative, editorial presence.
*   **The Metadata Layer:** `label-md` and `label-sm` should be used for technical data (ISO settings, shutter speeds, habit frequency). These should often be in all-caps with increased letter-spacing (+0.05em) to mimic the engraving on a camera lens.
*   **Body Copy:** `body-md` (0.875rem) provides the functional descriptions. It must always have generous line-height (1.5) to ensure the interface feels "breathable."

---

### 4. Elevation & Depth
Depth in this design system is achieved through "Tonal Layering" rather than traditional drop shadows.

*   **Layering Principle:** Place a `surface_container_lowest` card on top of a `surface_container_high` background. This creates a soft, natural hierarchy that feels like stacked fine-art paper.
*   **Ambient Shadows:** If a floating element (like a FAB or Menu) requires a shadow, it must be an "Ambient Shadow." Use `on_surface` (#1c1b1b) at 4% opacity with a blur radius of 40px and a Y-offset of 10px. It should feel like a soft glow, not a dark edge.
*   **The Ghost Border Fallback:** If a container sits on a background of the same color, use a "Ghost Border." Apply `outline_variant` (#d7c3b3) at 15% opacity. It should be barely perceptible—visible only when the eye searches for it.

---

### 5. Components

*   **Buttons:** 
    *   **Primary:** Gradient of `primary` to `primary_container`. No border. Roundedness: `md` (0.375rem).
    *   **Secondary:** `secondary_container` background with `on_secondary_container` text. 
    *   **Tertiary:** No background; use `tertiary` (#005bc1) for text to signal a "Technical Action."
*   **Habit Chips:** Use `secondary_container` for inactive habits and `primary` for active streaks. Forbid the use of borders; use a size increase or color shift to indicate state.
*   **Input Fields:** Use a "Minimalist Underline" style or a subtle background fill using `surface_container_highest`. Focus states should be indicated by a 2px transition of the `primary` color on the bottom edge only.
*   **Cards & Lists:** 
    *   **The "No-Divider" Rule:** Forbid the use of horizontal lines between list items. Instead, use 16px of vertical whitespace or an alternating background shift using `surface` and `surface_container_low`.
    *   **Image Hero Cards:** Images should have a `sm` (0.125rem) radius to feel "sharp" and professional.
*   **Technical Tooltips:** High-contrast `inverse_surface` background with `inverse_on_surface` text. Use for explaining photography terms (e.g., "Rule of Thirds").

---

### 6. Do's and Don'ts

*   **Do:** Use ample whitespace (`display-lg` text should have at least 40px of breathing room from the next element).
*   **Do:** Mix typographic weights. Pair a Bold `title-sm` with a Regular `body-sm` for technical density.
*   **Do:** Use the "Golden Hour" orange (`primary`) sparingly. It is a highlight, not a flood fill.
*   **Don't:** Use pure black (#000000). Use `on_background` (#1c1b1b) for deep tones to maintain a professional, "matte" look.
*   **Don't:** Use standard 1px borders. If you feel the need for a line, try a background color change first.
*   **Don't:** Center-align everything. Use asymmetrical layouts (e.g., left-aligned text paired with a right-aligned image) to create visual interest found in high-end magazines.