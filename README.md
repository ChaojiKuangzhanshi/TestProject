# 信扬供应链服务平台

本仓库包含一期需求文档和可运行的交互 Demo。当前 Demo 已完成门户视觉基座、全部一期模块入口、九类角色切换、公开价/企业协议价展示、方案直接购买、登录续购、Saber 风格管理工作台、企业业务中心和 Dify 配置入口。业务中心覆盖需求协同、组合采购车、订单审核与分批物流、需求计划与超额审批、企业主子账号、内容及批量上传、品牌配置和外部 Mock 适配状态。

## 文档

- `docs/product/requirement-clarification-log.md`：需求确认与决策记录
- `docs/product/feature-list.md`：一期功能清单
- `docs/product/prd.md`：产品需求文档
- `docs/product/user-stories.md`：用户故事
- `docs/product/acceptance-criteria.md`：验收标准
- `docs/product/development-plan.md`：开发计划
- `docs/product/test-plan.md`：测试方案
- `docs/superpowers/specs/2026-09-14-supply-chain-platform-design.md`：总体设计规格
- `docs/superpowers/plans/2026-09-14-supply-chain-demo.md`：Demo 实施计划

## 启动门户 Demo

```bash
cd apps/portal
npm install
npm run dev -- --host 127.0.0.1
```

浏览器访问 `http://127.0.0.1:5173/`。

## 验证

```bash
cd apps/portal
npm test
npm run build
```

## 演示说明

- 顶部“企业访客”可切换九类演示身份。
- 未登录时点击产品或方案购买会进入身份选择，完成后保留购买上下文。
- 顶部“需求协同 / 采购车 / 订单中心 / 需求计划”进入可操作的企业业务中心。
- 业务中心左侧可继续切换企业账号、内容运营和平台配置等一期模块。
- 点击产品卡片、方案卡片可进入详情页；搜索、方案对比、资讯列表均有独立二级页面。
- 公告支持完整正文、附件与收藏；产品咨询支持采购数量、交期、咨询类型和联系方式。
- 场景方案整套购买支持套数、地址、交期、发票及金额确认，未登录时登录后自动续接购买页。
- 需求新建/详情、版本对比、结算、代客建单、计划导入、子账号、资质和内容编辑采用可填写的步骤页。
- 所有业务表单统一为四步：基础信息、业务补充、汇总确认、提交结果；每一步展示不同内容，并支持上一步、继续新增和查看详情。
- 管理后台包含九个可切换模块，每个模块提供指标、查询、列表、查看/编辑抽屉和常用操作。
- “平台配置”中修改平台名称并保存，会立即同步到门户并保存在浏览器本地配置中。
- “管理后台”打开 Saber 风格的管理工作台；内容运营中包含产品等数据的批量上传入口。
- 右下角打开 Dify 智能客服演示入口。
- 所有数据均为模拟内容，不得用于生产。

当前阶段是用于范围、流程和界面确认的前端交互 Demo；正式项目的 SpringBlade Boot API、数据库、对象存储、Flowable 和真实 Dify/业务系统适配将在 Demo 确认后按模块开发。
