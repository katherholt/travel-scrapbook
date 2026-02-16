// Font configuration
// Swap to Sentient later by replacing the serif font-family in globals.css
// Using system font stacks with CSS variable hooks for easy swapping

// We define CSS variable names here so layout.tsx can apply them.
// Actual font loading happens via @font-face in globals.css (no build-time Google Fonts fetch).

export const fontVariables = "--font-sans --font-serif";

// Lightweight class strings for the <html> tag
export const fontClassNames = "";
