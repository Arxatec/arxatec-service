export function stripHtmlTags(htmlString: string): string {
  return htmlString.replace(/<[^>]*>/g, "");
}
export function estimateReadingTimeByCharacters(text: string): number {
  if (!text || text.length === 0) {
    return 0;
  }

  const CHARS_PER_MINUTE: number = 1000;

  const totalCharacters: number = text.length;
  const estimatedMinutes: number = totalCharacters / CHARS_PER_MINUTE;

  return Math.ceil(estimatedMinutes);
}
