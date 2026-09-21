export type WizardFieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file'

export interface WizardField {
  key: string
  label: string
  type: WizardFieldType
  value?: string | number
  options?: string[]
  help?: string
  wide?: boolean
}

export interface WizardStep {
  title: string
  description: string
  kind: 'form' | 'review' | 'result'
  fields: WizardField[]
}

export interface WizardDefinition {
  title: string
  steps: WizardStep[]
  result: { reference: string; message: string; status: string; actions: string[] }
}

const field = (key: string, label: string, type: WizardFieldType, value?: string | number, options?: string[], wide = false, help?: string): WizardField => ({ key, label, type, value, options, wide, help })
const form = (title: string, description: string, fields: WizardField[]): WizardStep => ({ title, description, kind: 'form', fields })
const review = (title: string, description: string): WizardStep => ({ title, description, kind: 'review', fields: [] })
const result = (title: string, description: string): WizardStep => ({ title, description, kind: 'result', fields: [] })
const definition = (title: string, first: WizardStep, second: WizardStep, reference: string, message: string, status: string, actions: string[]): WizardDefinition => ({
  title,
  steps: [first, second, review('确认提交', '复核前两步信息和业务规则，确认后生成业务记录。'), result('处理结果', '查看业务编号、当前状态和后续可执行操作。')],
  result: { reference, message, status, actions }
})

const contactFields = [field('contact', '联系人', 'text', '王敏'), field('phone', '联系电话', 'text', '138****6601')]

export const wizardDefinitions: Record<string, WizardDefinition> = {
  'demand-create': definition('新建需求工单', form('需求概况', '填写需求类型、场景和时间范围。', [field('name','需求标题','text','户外商显项目采购需求'),field('type','需求类型','select','方案定制',['产品选型','方案定制','价格与交期','技术支持']),field('industry','应用行业','select','商业零售',['商业零售','智慧办公','文旅户外','家庭娱乐']),field('budget','预算范围','select','10–50 万元',['10–50 万元','50–100 万元','100 万元以上']),field('date','预计采购时间','date','2026-10-15')]), form('参数与联系', '补充关键参数、附件和项目联系人。', [field('params','关键参数','textarea','尺寸：65英寸；亮度：≥2500nit；防护等级：IP65。',undefined,true),field('files','需求附件','file','',undefined,true,'支持图片、PDF、Word、Excel，单个文件不超过20MB'),...contactFields]), 'DEM-202609-034','需求工单已提交，预计4小时内响应。','待受理',['查看需求详情','继续新建需求']),
  'product-consultation': definition('产品咨询需求', form('咨询内容', '确认咨询产品、数量、交期和问题类型。', [field('quantity','预计采购数量','number',10),field('delivery','期望交期','date','2026-10-15'),field('kind','咨询类型','select','价格与交期',['价格与交期','技术参数','替代物料','样品申请']),field('scene','应用场景','text','商用显示项目'),field('detail','详细需求','textarea','请确认批量采购价格、库存及预计交付周期。',undefined,true)]), form('企业与联系人', '选择咨询企业并确认回复方式。', [field('company','所属企业','select','华中智显科技',['华中智显科技','信阳智造']),...contactFields,field('reply','期望回复方式','select','站内消息 + 短信',['站内消息 + 短信','电话','邮件'])]), 'DEM-202609-033','产品咨询已提交并进入需求协同队列。','待受理',['查看需求工单','返回产品详情']),
  'solution-checkout': definition('场景方案整套购买', form('方案与数量', '确认方案版本、套数和可调整项。', [field('quantity','方案套数','number',10),field('version','方案版本','text','标准版 V3.2'),field('optional','可选项处理','select','保留全部',['保留全部','移除可选主控板','联系工程师调整'])]), form('配送与结算', '填写收货、交期、发票和企业确认信息。', [field('address','收货地址','select','信阳市产业园区 A6 栋',['信阳市产业园区 A6 栋','郑州市高新区中心仓']),field('delivery','期望交期','date','2026-10-15'),field('invoice','发票类型','select','增值税专用发票',['增值税专用发票','增值税普通发票']),field('remark','订单备注','textarea','分批发货前请与采购联系人确认。',undefined,true)]), 'XY202609150021','方案订单已提交平台审核。','待审核',['查看订单详情','继续采购']),
  checkout: definition('采购车结算', form('商品与拆单', '确认商品数量、价格快照和拆单结果。', [field('group','采购组合','text','户外高亮数字标牌方案'),field('amount','协议价合计','text','¥62,080'),field('split','预计拆单','text','1个销售主体 / 1个仓库')]), form('收货与发票', '确认企业收货信息和开票资料。', [field('address','收货地址','text','信阳市产业园区 A6 栋'),field('delivery','期望交期','date','2026-10-15'),field('invoice','发票类型','select','增值税专用发票',['增值税专用发票','普通发票'])]), 'XY202609150022','采购车订单已提交企业主账号确认。','待企业确认',['查看订单','返回采购车']),
  'order-create': definition('销售代客建单', form('客户与商品', '选择客户、产品或方案并填写数量。', [field('company','客户企业','select','华中智显科技',['华中智显科技','信阳智造']),field('goods','商品/方案','text','户外高亮数字标牌方案 V3.2'),field('quantity','数量','number',10)]), form('价格与交付', '填写价格例外、交期和内部备注。', [field('price','销售价格','text','¥86,800'),field('delivery','承诺交期','date','2026-10-15'),field('reason','价格例外原因','textarea','无价格例外，使用企业协议价。',undefined,true)]), 'XY202609150023','代客订单已创建并等待客户确认。','待客户确认',['查看订单','继续建单']),
  'plan-import': definition('批量导入需求计划', form('上传与映射', '上传计划模板并选择产品公司和计划周期。', [field('company','产品公司','select','商显产品公司',['商显产品公司','智能终端公司']),field('period','计划周期','select','2026 Q4',['2026 Q4','2026年10月']),field('file','计划文件','file','',undefined,true,'支持平台Excel模板，最多1000行')]), form('校验结果', '处理格式错误、重复行和额度占用结果。', [field('valid','有效数据','text','186行'),field('invalid','异常数据','text','2行'),field('policy','异常处理','select','仅导入有效数据',['仅导入有效数据','返回修改后重传'])]), 'PLAN-2026Q4-07','需求计划已导入并生成额度审批记录。','特殊审批',['查看计划','下载错误报告']),
  'account-create': definition('新建子账号', form('账号信息', '填写成员身份和登录信息。', [field('name','姓名','text','李明'),field('mobile','手机号','text','139****2210'),field('department','部门','text','采购部')]), form('角色与权限', '配置角色、数据范围和订单确认规则。', [field('role','账号角色','select','采购子账号',['采购子账号','企业主账号']),field('scope','数据范围','select','本人数据',['本人数据','企业全部']),field('orderRule','订单规则','select','需主账号确认',['需主账号确认','可直接送审'])]), 'USR-202609-501','子账号已创建，激活短信已发送。','待激活',['查看账号','继续新增']),
  'credential-update': definition('更新企业资质', form('资质信息', '选择资质类型并填写有效期。', [field('type','资质类型','select','ISO 9001认证',['ISO 9001认证','产品质量认证']),field('number','证书编号','text','ISO-CN-2026-8891'),field('expires','有效期至','date','2027-09-15')]), form('文件与说明', '上传新证书并说明版本变化。', [field('file','资质文件','file','',undefined,true,'支持PDF、JPG、PNG'),field('note','更新说明','textarea','证书续期，新有效期至2027年。',undefined,true)]), 'CERT-202609-018','资质新版本已提交审核。','待审核',['查看资质','返回企业资料']),
  'content-edit': definition('内容编辑', form('内容信息', '填写内容类型、标题和展示范围。', [field('type','内容类型','select','平台公告',['平台公告','行业资讯','客户案例','首页轮播']),field('title','标题','text','国庆期间物流服务安排'),field('scope','展示范围','select','全部访客',['全部访客','登录企业'])]), form('正文与发布', '编辑摘要、正文和发布时间。', [field('summary','摘要','textarea','国庆期间平台服务和物流安排说明。',undefined,true),field('publish','发布时间','date','2026-09-28'),field('language','语言','select','中文',['中文','English'])]), 'CNT-202609-129','内容草稿已提交审核。','待审核',['查看内容','继续编辑']),
  'batch-upload': definition('产品批量上传', form('上传文件', '上传Excel数据文件和可选ZIP图片包。', [field('excel','产品数据Excel','file','',undefined,true,'最多1000条产品'),field('images','产品图片ZIP','file','',undefined,true,'图片名与产品编码一致')]), form('预校验与策略', '确认校验结果和已有产品更新策略。', [field('valid','有效产品','text','96条'),field('invalid','异常产品','text','4条'),field('strategy','重复编码处理','select','生成新版本',['生成新版本','跳过已有产品'])]), 'IMP-20260915-03','批量上传任务已创建，可在任务中心查看进度。','处理中',['查看导入任务','下载错误报告'])
}

const generic = definition('业务表单', form('基础信息','填写业务名称和所属企业。',[field('name','业务名称','text','演示业务记录'),field('company','所属企业','text','华中智显科技')]), form('补充信息','填写联系人和业务说明。',[...contactFields,field('note','说明','textarea','请按当前业务规则处理。',undefined,true)]), 'BIZ-202609-001','业务记录已提交。','待处理',['查看详情'])

export function getWizardDefinition(key: string) {
  return wizardDefinitions[key] ?? generic
}
