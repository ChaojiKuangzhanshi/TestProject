import { describe, expect, it } from 'vitest'
import { phaseOneRequirements } from '../demo/requirement-coverage'
import { secondaryPages } from '../demo/page-registry'

describe('phase-one requirement coverage', () => {
  it('tracks every source row from the phase-one worksheet', () => {
    expect(phaseOneRequirements).toHaveLength(36)
    expect(phaseOneRequirements.map(item => item.sourceRow)).toEqual(
      Array.from({ length: 36 }, (_, index) => index + 3)
    )
  })

  it('has executable demo evidence for every phase-one requirement', () => {
    const pageKeys = new Set(secondaryPages.map(page => page.key))
    expect(phaseOneRequirements.filter(item => item.status !== 'covered')).toEqual([])
    expect(phaseOneRequirements.filter(item => item.pageKey && !pageKeys.has(item.pageKey))).toEqual([])
    expect(phaseOneRequirements.every(item => item.evidence.length > 0)).toBe(true)
  })

  it('registers the newly identified detail experiences', () => {
    expect([...secondaryPages.map(page => page.key)]).toEqual(expect.arrayContaining([
      'scenario-center', 'qualification-center', 'smart-match', 'enterprise-register',
      'password-security', 'contact-center', 'order-evaluation', 'lead-center',
      'import-export-center', 'permission-center', 'workflow-designer', 'message-center',
      'i18n-preview', 'product-publish'
    ]))
  })
})
