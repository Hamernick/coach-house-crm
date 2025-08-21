import { describe, it, expect } from 'vitest'
import { renderBlocksToHtml, EmailBlock } from '@/lib/email/render'

describe('renderBlocksToHtml', () => {
  it('renders blocks to html snapshot', () => {
    const blocks: EmailBlock[] = [
      { id: '1', type: 'heading', content: 'Hello <World>' },
      { id: '2', type: 'paragraph', content: 'Paragraph & more' },
    ]
    const html = renderBlocksToHtml(blocks)
    expect(html).toMatchSnapshot()
  })
})
