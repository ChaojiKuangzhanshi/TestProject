import { describe, expect, it } from 'vitest'
import { normalizePlatformName } from '../demo/platform-config'

describe('platform configuration', () => {
  it('uses the agreed default when the configured name is blank', () => {
    expect(normalizePlatformName('   ')).toBe('信扬供应链服务平台')
  })

  it('trims a configured platform name', () => {
    expect(normalizePlatformName('  信扬产业协同平台  ')).toBe('信扬产业协同平台')
  })
})
