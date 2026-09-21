# 信扬供应链服务平台 Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建设覆盖全部一期页面、角色、状态和关键异常的可运行全栈 Demo。

**Architecture:** SpringBlade Boot 模块化单体作为后端基线，Vue 3 门户和 Saber 风格管理端独立构建。外部依赖统一通过适配接口调用，Demo 绑定本地模拟实现并支持数据重置。

**Tech Stack:** Java 21、Spring Boot、SpringBlade Boot、MyBatis-Plus、Flowable、MySQL 8、Redis、MinIO、Vue 3、TypeScript、Vite、Element Plus、Vitest、Playwright。

**Spec:** `docs/superpowers/specs/2026-09-14-supply-chain-platform-design.md`

## Global Constraints

- 平台显示名称必须来自配置，默认“信扬供应链服务平台”。
- Demo 覆盖全部一期功能，真实外部系统全部替换为模拟适配器。
- 企业、产品公司、角色、数据和字段权限必须在服务端执行。
- 门户和运营内容支持中英文，英文缺失回退中文。
- Demo 数据必须可一键恢复且不得包含生产数据。
- 普通接口 P95≤2 秒，搜索 P95≤3 秒，目标峰值 50 RPS。

---

### Task 1: 建立仓库结构和可启动基座

**Files:**
- Create: `apps/portal/`
- Create: `apps/admin/`
- Create: `services/platform/`
- Create: `infra/docker-compose.yml`
- Create: `scripts/demo-reset.sh`
- Create: `README.md`

**Interfaces:**
- Produces: 门户、管理端和 API 的启动命令；`POST /api/demo/reset`。

- [x] 先编写门户信息模型的失败测试。
- [x] 运行测试并确认因模型未实现而失败。
- [ ] 建立 Vue 3 应用、SpringBlade Boot 模块和本地基础设施配置。（Vue 3 门户已完成，后端与基础设施待接入）
- [ ] 实现健康检查、配置读取和可重复执行的数据重置。
- [x] 运行门户单元测试、生产构建和浏览器启动冒烟测试。

### Task 2: 实现认证、九类账号和权限骨架

**Files:**
- Create: `services/platform/modules/identity/`
- Create: `apps/portal/src/modules/auth/`
- Create: `apps/admin/src/modules/system/`

**Interfaces:**
- Produces: `POST /api/auth/login`、`GET /api/auth/me`、企业/角色/字段权限上下文。

- [ ] 先测试登录锁定、企业隔离、字段脱敏和管理员双因素认证。
- [x] 实现九类演示身份、登录续跳和前端权限情境。（服务端权限待正式开发）
- [x] 实现企业资料、资质、主子账号和联系人交互页面。（API 待正式开发）
- [ ] 验证跨企业页面、搜索、接口和导出均被拒绝。

### Task 3: 实现门户视觉系统和内容运营

**Files:**
- Create: `apps/portal/src/styles/`
- Create: `apps/portal/src/pages/home/`
- Create: `apps/admin/src/modules/content/`

**Interfaces:**
- Produces: 品牌配置、首页区块、公告、案例、平台资质和双语内容 API。

- [x] 编写品牌名称默认值和即时配置测试。（定时内容和英文回退待 API 阶段）
- [x] 实现参考图风格的导航、搜索、分类、方案、产品和信任背书布局。
- [x] 实现内容草稿、审核、发布、批量上传和版本操作的 Demo 交互。
- [ ] 在 1440、1280、1024 宽度进行视觉截图检查。（1280 首屏与管理端已检查）

### Task 4: 实现产品、分类和批量上传

**Files:**
- Create: `services/platform/modules/catalog/`
- Create: `apps/portal/src/modules/catalog/`
- Create: `apps/admin/src/modules/catalog/`

**Interfaces:**
- Produces: 产品查询、详情、分类参数、版本发布、Excel+ZIP 导入和错误报告。

- [ ] 编写分类参数、上下架、快照和导入校验测试。
- [ ] 实现产品门户与运营管理。
- [ ] 实现批量上传预校验、草稿和版本更新。
- [ ] 验证下架产品从搜索消失且历史订单快照不变。

### Task 5: 实现场景、方案、对比和规则推荐

**Files:**
- Create: `services/platform/modules/solution/`
- Create: `apps/portal/src/modules/solution/`
- Create: `apps/admin/src/modules/solution/`

**Interfaces:**
- Produces: 场景/方案 CRUD、版本、组合定价、对比、`POST /api/solutions/match`。

- [ ] 编写必选条件、排序权重、无结果和方案版本测试。
- [ ] 实现场景与方案门户和管理页。
- [ ] 实现 2～3 方案对比、差异高亮和直接购买入口。
- [ ] 验证方案必选项、可选项和替代项行为。

### Task 6: 实现需求、协同和线索

**Files:**
- Create: `services/platform/modules/demand/`
- Create: `services/platform/modules/lead/`
- Create: `apps/portal/src/modules/demand/`
- Create: `apps/admin/src/modules/demand/`

**Interfaces:**
- Produces: 需求草稿、提交、分派、SLA、会话、方案确认、线索去重和客户简化状态。

- [ ] 编写多入口续填、分派、SLA、版本锁定和线索去重测试。
- [x] 实现客户需求工作台和内部协同工作台 Demo。
- [x] 实现方案版本差异、确认和转购物车交互。
- [ ] 验证客户不能看到内部备注或直接修改工程师方案。

### Task 7: 实现价格、库存、购物车和订单

**Files:**
- Create: `services/platform/modules/commerce/`
- Create: `apps/portal/src/modules/cart/`
- Create: `apps/portal/src/modules/order/`
- Create: `apps/admin/src/modules/order/`

**Interfaces:**
- Produces: 价格解析、库存状态、组合购物车、拆单、客户/销售订单和订单状态机。

- [x] 编写公开/协议价、缺货、结算拦截和非法状态转换测试。
- [x] 实现购物车结算、企业内部确认和平台审核 Demo。
- [x] 实现销售代客订单、价格例外审批和版本确认 Demo。
- [ ] 验证并发提交幂等、订单金额及快照一致。

### Task 8: 实现履约、物流和评价

**Files:**
- Create: `services/platform/modules/fulfillment/`
- Create: `apps/portal/src/modules/fulfillment/`

**Interfaces:**
- Produces: 多次发货、商品级数量、物流时间线、评价和低分跟进。

- [ ] 编写部分发货、重复回调、全量签收和低分评价测试。
- [x] 实现分批物流模拟数据和客户订单时间线。
- [ ] 实现评价、一次修改、运营回复和跟进任务。

### Task 9: 实现需求计划和集采额度

**Files:**
- Create: `services/platform/modules/planning/`
- Create: `apps/portal/src/modules/planning/`
- Create: `apps/admin/src/modules/planning/`

**Interfaces:**
- Produces: 月/季度计划、Excel 导入、额度校验、特殊审批、执行量和额度释放。

- [x] 编写普通/超额计划和额度分配测试。
- [x] 实现产品公司计划工作台和特殊审批路径 Demo。
- [ ] 验证不同产品公司数据隔离和额度计算。

### Task 10: 实现工作流、消息、Dify 和外部适配

**Files:**
- Create: `services/platform/modules/workflow/`
- Create: `services/platform/modules/messaging/`
- Create: `services/platform/modules/integration/`
- Create: `apps/admin/src/modules/integration/`

**Interfaces:**
- Produces: Flowable 流程发布、通知事件、重试队列、Dify 代理和模拟 XTS/CRM/物流接口。

- [ ] 编写流程版本、消息重试、密钥隐藏、Dify 降级和接口幂等测试。
- [ ] 实现三个代表性可视化流程和受控业务动作。
- [x] 实现 Dify、XTS、CRM、物流和消息适配状态的 Mock 演示。
- [ ] 验证切换适配器不改变业务模块调用方式。

### Task 11: 实现全局搜索和通用导入导出

**Files:**
- Create: `services/platform/modules/search/`
- Create: `services/platform/modules/batch/`
- Create: `apps/portal/src/modules/search/`
- Create: `apps/admin/src/modules/batch/`

**Interfaces:**
- Produces: 授权搜索、异步任务、脱敏导出、限时下载。

- [ ] 编写搜索权限、中文模糊匹配、导出脱敏和链接过期测试。
- [ ] 实现统一搜索和筛选结果页。
- [ ] 实现后台任务进度、通知和任务审计。

### Task 12: 全流程、性能、安全和视觉验收

**Files:**
- Create: `tests/e2e/`
- Create: `tests/performance/`
- Create: `tests/security/`

**Interfaces:**
- Consumes: Tasks 1～11 的全部公开接口。
- Produces: 自动化验收报告和 Demo 启动说明。

- [ ] 实现测试方案中的八条 Playwright 端到端流程。
- [ ] 执行 50 RPS 性能测试并记录 P95 和错误率。
- [ ] 执行依赖、权限、上传和常见 Web 风险检查。
- [ ] 完成三种桌面宽度和中英文视觉检查。
- [ ] 从空环境执行一键启动、演示和重置。
