import { describe, expect, it } from 'vitest'
import { inlineBuiltHtml } from '../../scripts/build-single-html.mjs'

describe('single HTML export', () => {
  it('inlines local CSS and JavaScript and removes file dependencies', () => {
    const html = `<!doctype html><html><head>
      <link rel="icon" href="/favicon.svg" />
      <link rel="stylesheet" crossorigin href="/assets/app.css">
      <script type="module" crossorigin src="/assets/app.js"></script>
    </head><body><div id="app"></div></body></html>`
    const assets: Record<string, string> = {
      '/assets/app.css': 'body{color:#123}',
      '/assets/app.js': 'document.querySelector("#app").textContent="ok"'
    }

    const output = inlineBuiltHtml(html, path => assets[path])

    expect(output).toContain('<style>body{color:#123}</style>')
    expect(output).toContain('<script type="module">document.querySelector("#app").textContent="ok"</script>')
    expect(output).not.toMatch(/(?:src|href)=["'][^"']+\.(?:js|css|svg)/)
    expect(output).not.toContain('/assets/')
  })

  it('escapes a closing script sequence inside the bundle', () => {
    const html = '<script type="module" src="/assets/app.js"></script>'
    const output = inlineBuiltHtml(html, () => 'const marker = "</script>"')
    expect(output).toContain('<\\/script>')
  })

  it('fails when a referenced asset cannot be read', () => {
    const html = '<link rel="stylesheet" href="/assets/missing.css">'
    expect(() => inlineBuiltHtml(html, () => { throw new Error('missing') })).toThrow('missing')
  })
})
