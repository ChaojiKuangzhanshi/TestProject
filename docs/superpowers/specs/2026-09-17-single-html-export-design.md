# Demo 单文件 HTML 导出设计

## 目标

把当前 Vue/Vite 演示 Demo 导出为一个可直接双击打开的 HTML 文件。交付文件不得依赖 `assets` 目录、Node.js、本地服务、CDN 或网络资源。

## 方案

保留现有 Vite 生产构建流程。在构建完成后，由独立 Node.js 脚本读取 `dist/index.html`，定位其中的本地 JavaScript 与 CSS 资源，把资源内容分别替换为内联 `<script type="module">` 与 `<style>`，同时删除无法在单文件中使用的 favicon 链接。

输出文件固定为项目根目录 `信扬供应链服务平台-Demo.html`。脚本必须对残留的 `src`、`href` 本地资源引用进行校验，发现依赖时终止导出，防止交付不完整文件。

## 验收标准

- 单个 HTML 包含 Demo 的全部 JavaScript 与 CSS。
- HTML 中不存在 `/assets/`、相对 `.js`、相对 `.css` 或 favicon 文件引用。
- 通过 `file://` 直接打开后可显示门户，并可进入二级页面。
- 原项目测试和生产构建继续通过。
- 提供可重复执行的 `npm run build:single` 命令。

## 边界

导出文件保存浏览器本地状态时仍使用 `localStorage`。所有业务数据均为 Demo 内置模拟数据；真实后端接口、Dify、XTS、CRM 和物流系统不包含在单文件内。
