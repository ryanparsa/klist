import { defineCollection, defineConfig, s } from 'velite'
import rehypeShiki from '@shikijs/rehype'
import { visit } from 'unist-util-visit'
import type { Root, Element, Text } from 'hast'

// Convert mermaid code blocks to div.mermaid before Shiki processes them
function rehypeMermaid() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (
        node.tagName !== 'pre' ||
        !parent ||
        index === null ||
        index === undefined
      )
        return

      const code = node.children[0]
      if (
        !code ||
        code.type !== 'element' ||
        (code as Element).tagName !== 'code'
      )
        return

      const codeEl = code as Element
      const classes = (codeEl.properties?.className as string[]) ?? []
      if (!classes.includes('language-mermaid')) return

      const textNode = codeEl.children[0] as Text | undefined
      const content = textNode?.type === 'text' ? textNode.value : ''

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['mermaid'] },
        children: [{ type: 'text', value: content }],
      }
    })
  }
}

const linkSchema = s.object({
  title: s.string(),
  url: s.string().url(),
})

const practices = defineCollection({
  name: 'Practice',
  pattern: '../practices/{cloud,cluster,container,code}/*.yaml',
  schema: s
    .object({
      id: s.string(),
      title: s.string(),
      stage: s.enum(['draft', 'review', 'active', 'deprecated']),
      description: s.markdown({
        rehypePlugins: [
          rehypeMermaid,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [rehypeShiki as any, { themes: { light: 'github-light', dark: 'github-dark-default' } }],
        ],
      }),
      mitigations: s.array(s.string()),
      tags: s.array(s.string()),
      tools: s.array(linkSchema).default([]),
      references: s.array(linkSchema).default([]),
    })
    .transform((data, { meta }) => ({
      ...data,
      category: meta.path.split('/').at(-2) as string,
      hasMermaid: data.description.includes('class="mermaid"'),
    })),
})

const configs = defineCollection({
  name: 'Config',
  pattern: '../practices/config/*.yaml',
  schema: s.object({
    id: s.string(),
    label: s.string(),
    type: s.string(),
    description: s.string(),
    items: s.object({
      required: s.array(s.string()).default([]),
      suggested: s.array(s.string()).default([]),
    }),
  }),
})

export default defineConfig({
  root: '.',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { practices, configs },
})
