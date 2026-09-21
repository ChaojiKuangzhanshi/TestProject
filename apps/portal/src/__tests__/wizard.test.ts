import { describe, expect, it } from 'vitest'
import { getWizardDefinition, wizardDefinitions } from '../demo/wizard'

describe('form wizard definitions', () => {
  it('gives every form four distinct steps with content', () => {
    for (const definition of Object.values(wizardDefinitions)) {
      expect(definition.steps).toHaveLength(4)
      expect(new Set(definition.steps.map(step => step.title)).size).toBe(4)
      expect(definition.steps.every(step => step.description.length > 0)).toBe(true)
      expect(definition.steps.slice(0, 3).every(step => step.fields.length > 0 || step.kind === 'review')).toBe(true)
    }
  })

  it('provides a business reference and follow-up action after submission', () => {
    const definition = getWizardDefinition('demand-create')
    expect(definition.result.reference).toMatch(/^DEM-/)
    expect(definition.result.actions.length).toBeGreaterThan(0)
  })

  it('falls back to a generic four-step form for unknown form pages', () => {
    expect(getWizardDefinition('unknown').steps).toHaveLength(4)
  })
})
