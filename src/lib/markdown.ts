import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getMarkdownContent(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}

export function getTripMarkdown(slug: string) {
  return getMarkdownContent(`content/trips/${slug}.md`);
}
