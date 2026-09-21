import { describe, expect, it } from 'vitest'
import { demoRoles, filterProducts, navigationGroups, products, solutions } from '../demo/model'

describe('demo information model', () => {
  it('provides all nine confirmed user roles', () => {
    expect(demoRoles).toHaveLength(9)
    expect(demoRoles.map(role => role.key)).toEqual([
      'visitor', 'enterprise-admin', 'buyer', 'planner', 'operator',
      'sales', 'engineer', 'order-reviewer', 'system-admin'
    ])
  })

  it('covers every phase-one business domain in navigation', () => {
    const labels = navigationGroups.flatMap(group => group.items.map(item => item.label))
    expect(labels).toEqual(expect.arrayContaining([
      '首页', '产品中心', '解决方案', '需求协同', '采购车', '订单中心',
      '需求计划', '公告中心', '智能客服', '管理后台'
    ]))
  })

  it('contains purchasable products and solutions', () => {
    expect(products.some(product => product.price > 0 && product.stock !== '暂时缺货')).toBe(true)
    expect(solutions.every(solution => solution.items.length > 0 && solution.price > 0)).toBe(true)
  })

  it('filters products by the portal category group', () => {
    expect(filterProducts(products, '板卡套料').map(item => item.category)).toEqual(['主控板', '电源板'])
  })
})
