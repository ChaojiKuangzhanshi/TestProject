import { describe, expect, it } from 'vitest'
import { adminPages, getSecondaryPage, secondaryPages } from '../demo/page-registry'

describe('secondary page registry', () => {
  it('registers the portal and business detail pages used by the demo', () => {
    expect(secondaryPages.map(page => page.key)).toEqual(expect.arrayContaining([
      'product-detail', 'solution-detail', 'solution-compare', 'search-results', 'news-list',
      'demand-create', 'demand-detail', 'checkout', 'order-detail', 'plan-import',
      'account-create', 'credential-update', 'content-edit', 'batch-upload',
      'news-detail', 'product-consultation', 'solution-checkout', 'demand-success'
    ]))
  })

  it('falls back to a safe overview for an unknown page', () => {
    expect(getSecondaryPage('missing').key).toBe('overview')
  })

  it('registers all nine administration modules', () => {
    expect(adminPages).toHaveLength(9)
    expect(adminPages.map(page => page.key)).toContain('system')
  })
})
