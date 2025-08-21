export type EmailBlock = {
  id: string
  type: "heading" | "paragraph"
  content: string
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export function renderBlocksToHtml(blocks: EmailBlock[]): string {
  return blocks
    .map((block) => {
      const content = escapeHtml(block.content)
      switch (block.type) {
        case "heading":
          return `<h1>${content}</h1>`
        case "paragraph":
          return `<p>${content}</p>`
        default:
          return ""
      }
    })
    .join("\n")
}

export { renderBlocksToHtml as renderEmail }
