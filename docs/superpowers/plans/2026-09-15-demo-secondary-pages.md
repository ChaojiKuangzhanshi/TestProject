# Demo Secondary Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Demo 中的静态按钮补齐为覆盖一期范围的可操作二级页面。

**Architecture:** 使用统一页面注册模型驱动门户详情层、企业业务子页面和管理工作台。页面状态保留在前端内存，本轮不接入生产 API。

**Tech Stack:** Vue 3、TypeScript、Vite、Vitest。

**Spec:** `docs/superpowers/specs/2026-09-15-demo-secondary-pages-design.md`

## Global Constraints

- 不新增真实外部写入或真实文件上传。
- 平台名称继续由现有配置统一驱动。
- 所有入口均提供明确返回路径与操作反馈。

### Task 1: 页面注册与统一二级页

- [x] 编写页面注册和未知页面回退的失败测试。
- [x] 实现页面注册模型与门户二级页组件。
- [x] 接入商品、方案、对比、搜索和资讯按钮。
- [x] 运行单元测试和生产构建。

### Task 2: 企业业务中心子页面

- [x] 实现需求、订单、计划、账号和内容操作的表单/详情页。
- [x] 将提示型按钮替换为真实页面切换和状态反馈。
- [x] 验证返回、保存、确认和批量导入演示流程。

### Task 3: 管理后台二级页

- [x] 将静态管理抽屉拆为独立管理工作台组件。
- [x] 为九个菜单提供列表、配置、流程或监控页面。
- [x] 接入待办详情和常用操作。
- [x] 完成浏览器交互与响应式验收。
