import { clean } from '../../../../__test__/test-utils.js'
import { compileMdx } from '../../compile.js'

const opts = {
  mdxOptions: {
    outputFormat: 'program',
    jsx: true
  }
} as const

describe('remarkMdxTitle', () => {
  it('should take priority of yaml frontmatter', async () => {
    const { result } = await compileMdx(
      `---
title: From yaml frontMatter
---

# Hello`,
      opts
    )
    expect(clean(result.replace(/export function useTOC.+/s, ''))).resolves
      .toMatchInlineSnapshot(`
      "import { createElement } from 'react'
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      export const title = 'From yaml frontMatter'
      export const frontMatter = {
        title: 'From yaml frontMatter'
      }
      "
    `)
  })

  it('should take priority of esm frontmatter', async () => {
    const { result } = await compileMdx(
      `export const frontMatter = { title: 'From esm frontMatter' }

# Hello`,
      opts
    )
    expect(clean(result.replace(/export function useTOC.+/s, ''))).resolves
      .toMatchInlineSnapshot(`
      "import { createElement } from 'react'
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      export const title = 'From esm frontMatter'
      export const frontMatter = {
        title: 'From esm frontMatter'
      }
      "
    `)
  })

  it('should fallback to first h1', async () => {
    const { result } = await compileMdx(
      `## h2
# h1 1
# h1 2
`,
      opts
    )
    expect(clean(result.replace(/export function useTOC.+/s, ''))).resolves
      .toMatchInlineSnapshot(`
      "import { createElement } from 'react'
      import { useMDXComponents as _provideComponents } from 'nextra/mdx'
      export const title = 'h1 1'
      export const frontMatter = {}
      "
    `)
  })
})
