export interface TextChunk {
  text: string;
  index: number;
  name?: string;
  age?: string;
}

const MAX_CHARS = 1500;
const OVERLAP = 200;

// Fallback: lambi story ko overlap ke saath todta hai
const splitLong = (text: string): string[] => {
  const parts: string[] = [];
  let start = 0;
  while (start < text.length) {
    parts.push(text.slice(start, start + MAX_CHARS));
    start += MAX_CHARS - OVERLAP;
  }
  return parts;
};

export const splitIntoChunks = (rawText: string): TextChunk[] => {
   const text = rawText
  .replace(/\r/g, "")
  .replace(/^.*FUTURECUBS\s*\|\s*LITTLE STARS.*$/gim, "") // page header/footer removed
  .trim();

  const storyRegex = /\n(?=\s*\d{2}\.\s+\S)/g;
  let blocks = text
    .split(storyRegex)
    .map((b) => b.trim())
    .filter(Boolean);

  // Agar heading pattern nahi mila, to blank-line se split
  if (blocks.length < 3) {
    blocks = text
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter((b) => b.length > 80);
  }
  blocks = blocks.filter((b) => /^\d{2}\.\s+\S/.test(b));

  const chunks: string[] = [];
  for (const block of blocks) {
    if (block.length <= MAX_CHARS) chunks.push(block);
    else chunks.push(...splitLong(block));
  }

  return chunks.map((text, index) => {
  const nameMatch = text.match(/^\d{2}\.\s+(.+)$/m);
  const ageMatch = text.match(/AGEFATHERMOTHER\s*\n\s*(\d+\s*(?:Months|Month|Years|Year))/i);
  return {
    text,
    index,
    name: nameMatch?.[1]?.trim(),
    age: ageMatch?.[1]?.trim(),
  };
});
};