import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPattern = /<script\b([^>]*?)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi
const stylePattern = /<link\b(?=[^>]*\brel=["']stylesheet["'])(?=[^>]*\bhref=["']([^"']+)["'])[^>]*>/gi
const iconPattern = /\s*<link\b(?=[^>]*\brel=["'](?:icon|shortcut icon)["'])[^>]*>/gi

function escapeClosingScript(source) {
  return source.replace(/<\/script/gi, '<\\/script')
}

export function inlineBuiltHtml(html, readAsset) {
  let output = html.replace(iconPattern, '')

  output = output.replace(stylePattern, (_tag, assetPath) => {
    const css = readAsset(assetPath)
    return `<style>${css}</style>`
  })

  output = output.replace(scriptPattern, (_tag, before, assetPath, after) => {
    const source = escapeClosingScript(readAsset(assetPath))
    const attributes = `${before} ${after}`
    const type = /\btype=["']module["']/.test(attributes) ? ' type="module"' : ''
    return `<script${type}>${source}</script>`
  })

  const remainingDependency = output.match(/(?:src|href)=["'](?!data:|#|mailto:|tel:|https?:\/\/)[^"']+["']/i)
  if (remainingDependency) {
    throw new Error(`单文件导出仍存在外部文件依赖：${remainingDependency[0]}`)
  }
  if (output.includes('/assets/')) {
    throw new Error('单文件导出仍存在 /assets/ 引用')
  }
  return output
}

function buildSingleHtml() {
  const scriptDirectory = dirname(fileURLToPath(import.meta.url))
  const portalDirectory = resolve(scriptDirectory, '..')
  const distDirectory = join(portalDirectory, 'dist')
  const sourceHtml = readFileSync(join(distDirectory, 'index.html'), 'utf8')
  const result = inlineBuiltHtml(sourceHtml, assetPath => {
    const relativePath = assetPath.replace(/^\//, '')
    return readFileSync(join(distDirectory, relativePath), 'utf8')
  })
  const outputPath = resolve(portalDirectory, '..', '..', '信扬供应链服务平台-Demo.html')
  writeFileSync(outputPath, result, 'utf8')
  const sizeInMegabytes = (Buffer.byteLength(result) / 1024 / 1024).toFixed(2)
  console.log(`已生成：${outputPath}`)
  console.log(`文件大小：${sizeInMegabytes} MB`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildSingleHtml()
}
