import type { StockState } from './model'

export function resolvePrice(
  price: { publicPrice: number; agreementPrice?: number },
  loggedIn: boolean
) {
  if (loggedIn && price.agreementPrice != null) {
    return { amount: price.agreementPrice, type: '企业协议价' as const }
  }
  return { amount: price.publicPrice, type: '公开价' as const }
}

export interface CartLineState {
  stock: StockState
  active: boolean
  quantity: number
  minimum: number
}

export function canCheckout(lines: CartLineState[]) {
  const reasons: string[] = []
  if (lines.some(line => line.stock === '暂时缺货')) reasons.push('存在暂时缺货商品')
  if (lines.some(line => !line.active)) reasons.push('存在已下架商品')
  if (lines.some(line => line.quantity < line.minimum)) reasons.push('存在低于最小起订量的商品')
  return { allowed: reasons.length === 0, reasons }
}

type OrderState = '待提交' | '待审核' | '审核驳回' | '待客户确认' | '生产备货' | '待发货' | '已发货' | '已签收' | '已完成'
type OrderAction = 'submit' | 'approve' | 'reject' | 'confirm' | 'ready' | 'ship' | 'receive' | 'complete' | 'cancel'

const transitions: Partial<Record<OrderState, Partial<Record<OrderAction, OrderState>>>> = {
  待提交: { submit: '待审核' },
  待审核: { approve: '待客户确认', reject: '审核驳回', cancel: '待提交' },
  审核驳回: { submit: '待审核' },
  待客户确认: { confirm: '生产备货', reject: '审核驳回', cancel: '待提交' },
  生产备货: { ready: '待发货', cancel: '审核驳回' },
  待发货: { ship: '已发货' },
  已发货: { receive: '已签收' },
  已签收: { complete: '已完成' }
}

export function transitionOrder(state: OrderState, action: OrderAction): OrderState {
  const next = transitions[state]?.[action]
  if (!next) throw new Error(action === 'cancel' ? '当前状态不允许取消' : '当前状态不允许该操作')
  return next
}

export function allocatePlan(requested: number, remaining: number) {
  const occupied = Math.min(requested, remaining)
  const excess = Math.max(requested - remaining, 0)
  return { status: excess > 0 ? '特殊审批' : '待审核', occupied, excess }
}
