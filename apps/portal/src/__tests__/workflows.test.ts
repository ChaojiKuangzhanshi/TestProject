import { describe, expect, it } from 'vitest'
import { allocatePlan, canCheckout, resolvePrice, transitionOrder } from '../demo/workflows'

describe('commerce workflows', () => {
  it('uses an enterprise agreement price before the public price', () => {
    expect(resolvePrice({ publicPrice: 2380, agreementPrice: 2260 }, true)).toEqual({ amount: 2260, type: '企业协议价' })
    expect(resolvePrice({ publicPrice: 2380 }, true)).toEqual({ amount: 2380, type: '公开价' })
    expect(resolvePrice({ publicPrice: 2380, agreementPrice: 2260 }, false)).toEqual({ amount: 2380, type: '公开价' })
  })

  it('blocks checkout for unavailable or invalid cart lines', () => {
    expect(canCheckout([{ stock: '现货', active: true, quantity: 10, minimum: 5 }])).toEqual({ allowed: true, reasons: [] })
    expect(canCheckout([
      { stock: '暂时缺货', active: true, quantity: 10, minimum: 5 },
      { stock: '现货', active: false, quantity: 1, minimum: 5 }
    ])).toEqual({ allowed: false, reasons: ['存在暂时缺货商品', '存在已下架商品', '存在低于最小起订量的商品'] })
  })
})

describe('order and planning workflows', () => {
  it('only allows configured order state transitions', () => {
    expect(transitionOrder('待审核', 'approve')).toBe('待客户确认')
    expect(() => transitionOrder('已发货', 'cancel')).toThrow('当前状态不允许取消')
  })

  it('routes over-quota plans to special approval', () => {
    expect(allocatePlan(800, 1000)).toEqual({ status: '待审核', occupied: 800, excess: 0 })
    expect(allocatePlan(1200, 1000)).toEqual({ status: '特殊审批', occupied: 1000, excess: 200 })
  })
})
