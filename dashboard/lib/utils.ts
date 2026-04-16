import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Render inline markdown (bold, italic, code, links) as an HTML string. */
export function inlineMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // fenced code blocks → compact <pre>
    .replace(/```[a-z]*\n?([\s\S]*?)```/g, (_, code) =>
      `<pre class="inline-code-block"><code>${code.trim()}</code></pre>`
    )
    // inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // line breaks
    .replace(/\n/g, "<br>")
}
