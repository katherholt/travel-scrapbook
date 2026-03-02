// Shared postcard content parser
export function parseHighlights(markdown: string) {
  const sections = markdown.split(/<!-- PAGE: ([\w-]+) -->/);

  function getSection(name: string) {
    const idx = sections.indexOf(name);
    return idx >= 0 ? sections[idx + 1] : "";
  }

  // About: first real paragraph (skip headings, frontmatter, bold-only lines)
  const aboutRaw = getSection("about");
  const aboutText =
    aboutRaw
      .split("\n")
      .map((l) => l.trim())
      .find(
        (l) =>
          l.length > 40 &&
          !l.startsWith("#") &&
          !l.startsWith("---") &&
          !l.startsWith("**"),
      ) || "";

  // Dishes: restaurant names from ### headings
  const dishes = [...getSection("dishes").matchAll(/### \d+\.\s+(.+)/g)].map(
    (m) => m[1],
  );

  // Sights
  const sights = [
    ...getSection("local-lore").matchAll(/### \d+\.\s+(.+)/g),
  ].map((m) => m[1]);

  // Phrases
  const phrases = [
    ...getSection("phrases").matchAll(/\*\*"(.+?)"\*\*\s*—\s*(.+)/g),
  ]
    .slice(0, 3)
    .map((m) => ({ phrase: m[1], meaning: m[2] }));

  return { aboutText, dishes, sights, phrases };
}
