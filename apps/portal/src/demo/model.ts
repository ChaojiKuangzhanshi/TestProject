export type StockState = '现货' | '库存紧张' | '预订/需确认交期' | '暂时缺货'

export interface DemoRole {
  key: string
  label: string
  description: string
}

export interface Product {
  id: number
  name: string
  code: string
  category: string
  price: number
  agreementPrice?: number
  stock: StockState
  accent: string
  specs: string[]
}

export interface Solution {
  id: number
  name: string
  scene: string
  version: string
  price: number
  items: string[]
  highlight: string
  accent: string
}

export const demoRoles: DemoRole[] = [
  { key: 'visitor', label: '企业访客', description: '浏览公开内容、价格与提交注册' },
  { key: 'enterprise-admin', label: '企业主账号', description: '管理企业资料、子账号与订单确认' },
  { key: 'buyer', label: '采购子账号', description: '选型、提交需求与采购下单' },
  { key: 'planner', label: '产品公司业务人员', description: '提报需求计划与查看集采额度' },
  { key: 'operator', label: '平台运营', description: '内容、客户、工单与客服运营' },
  { key: 'sales', label: '销售人员', description: '跟进线索、需求与代客订单' },
  { key: 'engineer', label: '方案工程师', description: '修订参数与提交方案版本' },
  { key: 'order-reviewer', label: '订单审核', description: '审核订单与价格例外' },
  { key: 'system-admin', label: '系统管理员', description: '权限、流程、集成与平台配置' }
]

export const navigationGroups = [
  { label: '采购服务', items: [
    { label: '首页', target: 'home' }, { label: '产品中心', target: 'products' },
    { label: '解决方案', target: 'solutions' }, { label: '需求协同', target: 'demand' }
  ]},
  { label: '业务中心', items: [
    { label: '采购车', target: 'cart' }, { label: '订单中心', target: 'orders' },
    { label: '需求计划', target: 'plans' }, { label: '公告中心', target: 'news' }
  ]},
  { label: '服务与管理', items: [
    { label: '智能客服', target: 'assistant' }, { label: '管理后台', target: 'admin' }
  ]}
]

export const categories = [
  ['液晶显示', '液晶屏', '背光模组', '显示器件'],
  ['板卡与套料', '主控板', '电源板', '标准套料'],
  ['音响器件', '扬声器', '功放板', '麦克风'],
  ['深加工物料', '结构件', '线束', '定制组件'],
  ['智能硬件', '传感器', '通信模组', '边缘终端'],
  ['技术服务', '选型支持', '联合设计', '交付服务']
]

export const products: Product[] = [
  { id: 1, name: '55英寸 4K 商显液晶屏', code: 'XY-LCD-5504', category: '液晶屏', price: 2380, agreementPrice: 2260, stock: '现货', accent: '#e54a4a', specs: ['3840×2160', '500nit', 'LVDS'] },
  { id: 2, name: '安卓智能主控板 A73', code: 'XY-MB-A730', category: '主控板', price: 568, agreementPrice: 528, stock: '库存紧张', accent: '#3566b8', specs: ['4+32GB', '双频Wi-Fi', 'HDMI 2.0'] },
  { id: 3, name: '高效率数字功放板', code: 'XY-AUD-D220', category: '功放板', price: 186, stock: '现货', accent: '#14a37f', specs: ['2×120W', 'DSP', '低失真'] },
  { id: 4, name: '工业级电源板 220W', code: 'XY-PWR-220', category: '电源板', price: 298, stock: '预订/需确认交期', accent: '#f09a38', specs: ['90-264V', '过压保护', '85%效率'] },
  { id: 5, name: '远场阵列麦克风模组', code: 'XY-MIC-6A', category: '麦克风', price: 328, agreementPrice: 309, stock: '现货', accent: '#7457d7', specs: ['6阵列', '5米拾音', 'AEC'] },
  { id: 6, name: '低功耗 Wi-Fi 6 模组', code: 'XY-IOT-WF6', category: '通信模组', price: 76, stock: '暂时缺货', accent: '#2d8da8', specs: ['802.11ax', '蓝牙5.2', '工业温度'] },
  { id: 7, name: '65英寸户外高亮屏', code: 'XY-LCD-650H', category: '液晶屏', price: 5960, stock: '库存紧张', accent: '#cf395f', specs: ['2500nit', 'IP65', '4K'] },
  { id: 8, name: '智能音响标准线束包', code: 'XY-CBL-SPK', category: '线束', price: 42, stock: '现货', accent: '#53677b', specs: ['8件套', '阻燃', '定制端子'] }
]

const productCategoryGroups: Record<string, string[]> = {
  '液晶显示': ['液晶屏'],
  '板卡套料': ['主控板', '电源板'],
  '音响器件': ['功放板', '麦克风', '线束'],
  '智能硬件': ['通信模组']
}

export function filterProducts(items: Product[], category: string) {
  if (category === '全部') return items
  const members = productCategoryGroups[category] ?? []
  return items.filter(item => members.includes(item.category))
}

export const solutions: Solution[] = [
  { id: 1, name: '户外高亮数字标牌方案', scene: '户外商业', version: '标准版 V3.2', price: 8680, items: ['65英寸高亮屏', '智能主控板', '工业电源板'], highlight: '全天候高亮显示，支持远程内容管理', accent: '#d9272e' },
  { id: 2, name: '家庭派对音响套料方案', scene: '派对娱乐', version: '高端版 V2.0', price: 3980, items: ['数字功放板', '阵列麦克风', '扬声器套件'], highlight: '一体化音频链路，兼顾K歌与音乐播放', accent: '#315eae' },
  { id: 3, name: '会议室智能显示方案', scene: '智慧办公', version: '标准版 V1.8', price: 6290, items: ['55英寸4K屏', '安卓主控板', 'Wi-Fi模组'], highlight: '无线投屏与集中运维，适配中型会议室', accent: '#16917d' }
]

export const workspaceCards = [
  { title: '需求协同', value: '6', meta: '2项等待客户确认', tone: 'red' },
  { title: '我的订单', value: '12', meta: '3项正在履约', tone: 'blue' },
  { title: '需求计划', value: '4', meta: '剩余额度 68%', tone: 'green' },
  { title: '待办与通知', value: '9', meta: '1项即将超时', tone: 'orange' }
]

export const capabilityCards = [
  ['方案智能匹配', '输入关键参数，获得可解释的套料推荐'],
  ['在线协同确认', '需求、参数、附件和方案版本全程留痕'],
  ['企业协议价格', '登录后自动呈现企业适用价格'],
  ['订单全程可视', '审核、备货、发货和签收状态持续跟踪']
]
