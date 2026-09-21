export interface SecondaryPageDefinition {
  key: string
  title: string
  eyebrow: string
}

export const secondaryPages: SecondaryPageDefinition[] = [
  { key: 'overview', title: '业务概览', eyebrow: 'OVERVIEW' },
  { key: 'product-detail', title: '产品详情', eyebrow: 'PRODUCT DETAIL' },
  { key: 'solution-detail', title: '方案详情', eyebrow: 'SOLUTION DETAIL' },
  { key: 'solution-compare', title: '方案对比', eyebrow: 'SOLUTION COMPARE' },
  { key: 'search-results', title: '搜索结果', eyebrow: 'SEARCH' },
  { key: 'news-list', title: '资讯与公告', eyebrow: 'INSIGHTS' },
  { key: 'news-detail', title: '公告详情', eyebrow: 'ANNOUNCEMENT' },
  { key: 'product-consultation', title: '产品咨询需求', eyebrow: 'PRODUCT INQUIRY' },
  { key: 'solution-checkout', title: '场景方案购买确认', eyebrow: 'SOLUTION ORDER' },
  { key: 'demand-create', title: '新建需求', eyebrow: 'NEW DEMAND' },
  { key: 'demand-success', title: '需求提交成功', eyebrow: 'DEMAND CREATED' },
  { key: 'demand-detail', title: '需求协同详情', eyebrow: 'DEMAND DETAIL' },
  { key: 'checkout', title: '确认结算', eyebrow: 'CHECKOUT' },
  { key: 'order-detail', title: '订单详情', eyebrow: 'ORDER DETAIL' },
  { key: 'order-create', title: '销售代客建单', eyebrow: 'CREATE ORDER' },
  { key: 'plan-import', title: '批量导入需求计划', eyebrow: 'PLAN IMPORT' },
  { key: 'account-create', title: '新建子账号', eyebrow: 'NEW ACCOUNT' },
  { key: 'credential-update', title: '更新企业资质', eyebrow: 'CREDENTIAL' },
  { key: 'content-edit', title: '内容编辑', eyebrow: 'CONTENT EDITOR' },
  { key: 'batch-upload', title: '产品批量上传', eyebrow: 'BATCH UPLOAD' },
  { key: 'version-compare', title: '方案版本对比', eyebrow: 'VERSION COMPARE' },
  { key: 'scenario-center', title: '场景筛选与导航', eyebrow: 'SCENARIO CENTER' },
  { key: 'qualification-center', title: '平台资质', eyebrow: 'QUALIFICATIONS' },
  { key: 'smart-match', title: '套料方案智能匹配', eyebrow: 'SMART MATCH' },
  { key: 'enterprise-register', title: '企业注册与审核', eyebrow: 'ENTERPRISE REGISTER' },
  { key: 'password-security', title: '账号与密码安全', eyebrow: 'ACCOUNT SECURITY' },
  { key: 'contact-center', title: '企业联系人', eyebrow: 'CONTACTS' },
  { key: 'order-evaluation', title: '订单评价', eyebrow: 'ORDER REVIEW' },
  { key: 'lead-center', title: '咨询线索', eyebrow: 'LEADS' },
  { key: 'import-export-center', title: '导入导出任务', eyebrow: 'IMPORT & EXPORT' },
  { key: 'permission-center', title: '权限策略', eyebrow: 'PERMISSION' },
  { key: 'workflow-designer', title: '工作流设计器', eyebrow: 'WORKFLOW' },
  { key: 'message-center', title: '消息规则与重试', eyebrow: 'MESSAGING' },
  { key: 'i18n-preview', title: '中英文内容预览', eyebrow: 'I18N' },
  { key: 'product-publish', title: '产品发布与上下架', eyebrow: 'PRODUCT PUBLISH' }
]

export function getSecondaryPage(key: string) {
  return secondaryPages.find(page => page.key === key) ?? secondaryPages[0]
}

export const adminPages = [
  { key: 'dashboard', label: '工作台', title: '管理工作台' },
  { key: 'content', label: '内容管理', title: '内容审核与发布' },
  { key: 'catalog', label: '产品与方案', title: '产品、分类与方案' },
  { key: 'enterprise', label: '企业客户', title: '企业客户与账号' },
  { key: 'demand', label: '需求与线索', title: '需求工单与销售线索' },
  { key: 'order', label: '订单履约', title: '订单审核与履约' },
  { key: 'planning', label: '需求计划', title: '计划与集采额度' },
  { key: 'workflow', label: '流程与消息', title: '流程、消息与任务' },
  { key: 'system', label: '系统管理', title: '权限、配置与集成' }
] as const
