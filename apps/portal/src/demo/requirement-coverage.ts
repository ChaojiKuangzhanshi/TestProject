export type CoverageStatus = 'covered' | 'partial' | 'missing'

export interface RequirementCoverage {
  sourceRow: number
  module: string
  submodule: string
  status: CoverageStatus
  pageKey?: string
  evidence: string
}

const covered = (sourceRow: number, module: string, submodule: string, pageKey: string | undefined, evidence: string): RequirementCoverage => ({ sourceRow, module, submodule, status: 'covered', pageKey, evidence })

/** One entry for every data row in “需求清单——一期” (rows 3–38). */
export const phaseOneRequirements: RequirementCoverage[] = [
  covered(3,'首页管理','首页展示','qualification-center','门户首页、分类、方案、案例及平台资质详情'),
  covered(4,'首页管理','首页信息发布','content-edit','首页运营内容编辑、跳转、生效时间与审核'),
  covered(5,'场景管理','场景展示','scenario-center','行业/场景/尺寸/参数筛选与方案结果'),
  covered(6,'场景管理','方案发布','solution-detail','方案组成、参数、案例、咨询及整套购买'),
  covered(7,'场景管理','客户需求提交','smart-match','参数需求、附件工单与可解释规则推荐'),
  covered(8,'场景管理','场景方案交互','demand-detail','会话留痕、方案迭代、客户确认和转订单'),
  covered(9,'场景管理','方案版本对比','solution-compare','一期覆盖2–3套结构化对比；AI优劣势按澄清结论延期'),
  covered(10,'公告管理','公告展示','news-detail','公告分类、列表及全文详情'),
  covered(11,'公告管理','公告发布','content-edit','上下线、定时发布、弹窗、归档与审核'),
  covered(12,'产品管理','产品发布','product-publish','物料录入、参数图片分类、草稿和审核发布'),
  covered(13,'产品管理','产品展示','product-detail','图片、参数、资料、库存、配套方案、购物及需求'),
  covered(14,'产品管理','产品上下架','product-publish','上架/下架、版本保留及购物车失效规则'),
  covered(15,'产品管理','产品分类分区','scenario-center','事业部/业务线/物料类型多级导航'),
  covered(16,'产品管理','产品检索','search-results','名称、编码、规格参数与品类筛选'),
  covered(17,'账号管理','账号注册','enterprise-register','企业主体、联系人、资质上传、去重与审核'),
  covered(18,'账号管理','账号密码修改','password-security','修改、找回、锁定、双因素及安全日志'),
  covered(19,'账号管理','主/子账号信息','account-create','子账号、功能权限、数据范围和订单确认规则'),
  covered(20,'账号管理','企业资质管理','credential-update','资质上传、审核状态、版本及到期提醒'),
  covered(21,'销售订单管理','订单创建','order-create','购物车成单、销售代客建单与客户确认'),
  covered(22,'销售订单管理','订单审核','order-detail','审核状态、驳回原因、重提/撤回/取消'),
  covered(23,'销售订单管理','订单状态跟踪','order-detail','全流程状态、多批发货和物流轨迹'),
  covered(24,'销售订单管理','我的订单','order-detail','订单列表、多条件筛选和物料明细'),
  covered(25,'销售订单管理','订单评价','order-evaluation','质量/交付/服务评分、图片及低分跟进'),
  covered(26,'购物车管理','加入购物车','checkout','产品/方案加入、组合保留及账号隔离'),
  covered(27,'购物车管理','购物车产品展示','checkout','图片、编码、规格、数量、单价、小计和选择删除'),
  covered(28,'购物车管理','购物车结算','checkout','勾选结算、收货交付、价格库存复核和无支付审核'),
  covered(29,'合作管理','留言咨询','lead-center','资讯/方案/案例入口提交联系人并沉淀线索'),
  covered(30,'合作管理','线索录入','lead-center','主动咨询生成、去重、分派和客户状态'),
  covered(31,'合作管理','联系人管理','contact-center','新增、编辑、停用、默认联系人与消息订阅'),
  covered(32,'客服管理','智能客服',undefined,'门户悬浮 Dify 问答、推荐问题及转留言线索'),
  covered(33,'通用功能','多语言','i18n-preview','中英文界面、内容翻译状态和中文回退'),
  covered(34,'通用功能','全局检索能力','search-results','全局模糊查询、分类标签及高级筛选入口'),
  covered(35,'通用功能','导入导出功能','import-export-center','模板、预校验、异步进度、错误报告及限时下载'),
  covered(36,'通用功能','权限管理','permission-center','菜单/字段/数据/跨组织、复制、转移及日志'),
  covered(37,'通用功能','工作流引擎','workflow-designer','可视化节点、条件/并行、业务动作和通知人'),
  covered(38,'通用功能','邮件提醒等消息通知','message-center','渠道适配、规则模板、已读、失败重试和告警')
]
