<script setup lang="ts">
import { computed, ref } from 'vue'
import { adminPages } from '../demo/page-registry'
import SecondaryPage from './SecondaryPage.vue'

defineProps<{ platformName: string }>()
defineEmits<{ close: [] }>()
const active = ref<(typeof adminPages)[number]['key']>('dashboard')
const drawer = ref('')
const notice = ref('')
const detailPage = ref('')
const page = computed(() => adminPages.find(item => item.key === active.value) ?? adminPages[0])

const pageData: Record<string, { metrics: string[][]; rows: string[][]; columns: string[]; action: string }> = {
  dashboard: { metrics: [['待审核企业','8'],['待响应需求','6'],['待审核订单','12'],['同步异常','2']], columns:['类型','业务编号','申请人','状态'], rows:[['企业注册','ENT-202609-018','信阳智造','待初审'],['产品发布','PRD-XY-LCD-5504','平台运营','待审核'],['订单审核','XY202609140018','华中智显','待审核']], action:'处理待办' },
  content: { metrics: [['待审核','3'],['已发布','128'],['定时发布','4'],['草稿','16']], columns:['类型','标题','提交人','状态'], rows:[['首页轮播','秋季企业解决方案','平台运营','待审核'],['公告','国庆物流安排','平台运营','待审核'],['案例','智慧会议室项目','内容运营','草稿']], action:'新建内容' },
  catalog: { metrics: [['产品','1,000'],['方案','200'],['待审核','6'],['导入任务','2']], columns:['编码','名称','版本','状态'], rows:[['XY-LCD-5504','55英寸商显液晶屏','V2.3','已上架'],['SOL-OUT-032','户外高亮标牌方案','V3.2','已发布'],['IMP-20260915','产品批量导入','第2批','校验中']], action:'批量上传' },
  enterprise: { metrics: [['企业客户','100'],['注册用户','500'],['待审核','8'],['资质到期','12']], columns:['企业编号','企业名称','类型','状态'], rows:[['ENT-018','信阳智造','采购企业','待初审'],['ENT-006','华中智显科技','采购企业','正常'],['ENT-002','商显产品公司','产品公司','正常']], action:'新建企业' },
  demand: { metrics: [['待受理','3'],['处理中','6'],['临近超时','1'],['线索','28']], columns:['编号','需求/线索','负责人','状态'], rows:[['DEM-031','户外高亮屏定制','张工','待客户确认'],['DEM-028','智能音响套料','李工','处理中'],['LEAD-086','批量屏采购咨询','王销售','新线索']], action:'新建需求' },
  order: { metrics: [['待审核','12'],['执行中','26'],['待发货','8'],['异常','1']], columns:['订单编号','客户','金额','状态'], rows:[['XY202609140018','华中智显','¥86,420','生产备货'],['XY202609130012','信阳智造','¥32,680','待客户确认'],['XY202609120008','豫南科技','¥18,900','已发货']], action:'销售建单' },
  planning: { metrics: [['计划批次','4'],['提报企业','12'],['特殊审批','3'],['执行率','68%']], columns:['计划编号','产品公司','金额','状态'], rows:[['PLAN-Q4-06','商显产品公司','¥1,200,000','特殊审批'],['PLAN-Q4-05','智能终端公司','¥680,000','已通过'],['PLAN-M09-12','音响产品公司','¥320,000','执行中']], action:'导入计划' },
  workflow: { metrics: [['已发布流程','6'],['运行实例','31'],['失败消息','2'],['重试任务','4']], columns:['类型','名称','版本','状态'], rows:[['流程','订单审核流程','V3','已发布'],['流程','特殊额度审批','V2','已发布'],['消息','订单确认短信','重试2次','待重试']], action:'新建流程' },
  system: { metrics: [['角色','9'],['菜单','64'],['接口适配器','5'],['审计事件','1,286']], columns:['配置项','当前值','更新时间','状态'], rows:[['平台名称','信扬供应链服务平台','刚刚','生效'],['Dify 服务','http://dify.internal/v1','09-15','未连接'],['XTS Mock','本地模拟器','09-15','正常']], action:'新增配置' }
}
const current = computed(() => pageData[active.value])

function openDrawer(title: string) { drawer.value = title }
function save() { notice.value = `${drawer.value}已保存，操作已写入审计日志`; drawer.value = ''; window.setTimeout(() => notice.value = '', 2400) }

const capabilityLinks: Record<string, [string, string][]> = {
  catalog: [['产品发布与上下架','product-publish'],['批量任务','import-export-center']],
  enterprise: [['企业注册审核','enterprise-register'],['权限策略','permission-center']],
  demand: [['线索管理','lead-center'],['智能匹配','smart-match']],
  order: [['订单评价','order-evaluation'],['消息通知','message-center']],
  workflow: [['可视化流程设计','workflow-designer'],['消息规则与重试','message-center']],
  system: [['权限策略','permission-center'],['导入导出任务','import-export-center'],['中英文预览','i18n-preview']]
}
</script>

<template>
  <div class="admin-shell">
    <aside><div class="admin-brand"><b>XY</b><span>{{ platformName }}</span><small>SpringBlade 管理端</small></div><button v-for="item in adminPages" :key="item.key" :class="{active:active===item.key}" @click="active=item.key">{{ item.label }}</button></aside>
    <main><header><div><span>管理后台 / {{ page.label }}</span><h1>{{ page.title }}</h1></div><div><button @click="openDrawer('全局搜索')">全局搜索</button><button @click="$emit('close')">返回门户</button></div></header>
      <div v-if="notice" class="notice">{{ notice }}</div>
      <section class="metrics"><article v-for="item in current.metrics" :key="item[0]"><span>{{ item[0] }}</span><b>{{ item[1] }}</b><small>查看详情 →</small></article></section>
      <section class="toolbar"><div><input :placeholder="`搜索${page.label}`" /><button @click="notice='查询完成，共 3 条演示数据'">查询</button><button @click="notice='筛选条件已重置'">重置</button></div><button class="primary" @click="openDrawer(current.action)">{{ current.action }}</button></section>
      <section v-if="capabilityLinks[active]" class="capability-links"><button v-for="link in capabilityLinks[active]" :key="link[1]" @click="detailPage=link[1]">{{ link[0] }} →</button></section>
      <section class="data"><div class="data-head"><b>{{ page.title }}列表</b><div><button @click="notice='数据已刷新'">刷新</button><button @click="notice='当前列表已导出'">导出</button></div></div><table><thead><tr><th v-for="column in current.columns" :key="column">{{ column }}</th><th>操作</th></tr></thead><tbody><tr v-for="row in current.rows" :key="row[0]"><td v-for="cell in row" :key="cell"><i v-if="['待审核','待初审','特殊审批','异常','未连接','待重试'].some(s=>cell.includes(s))">{{ cell }}</i><span v-else>{{ cell }}</span></td><td><button class="link" @click="openDrawer(`${row[0]} 详情`)">查看</button><button class="link" @click="openDrawer(`${row[0]} 编辑`)">编辑</button></td></tr></tbody></table></section>
      <section v-if="active==='dashboard' || active==='system'" class="status-grid"><article><h3>外部服务状态</h3><p><span>XTS 模拟器</span><b>正常</b></p><p><span>CRM 模拟器</span><b>正常</b></p><p><span>Dify 本地服务</span><em>未连接</em></p></article><article><h3>快捷操作</h3><div><button @click="openDrawer('企业审核')">企业审核</button><button @click="openDrawer('订单审核')">订单审核</button><button @click="openDrawer('批量上传')">批量上传</button><button @click="openDrawer('Dify 配置')">Dify 配置</button></div></article></section>
    </main>
    <div v-if="drawer" class="drawer"><header><div><small>{{ page.label }}</small><h2>{{ drawer }}</h2></div><button @click="drawer=''">×</button></header><div class="drawer-body"><label>名称<input :value="drawer" /></label><label>负责人<select><option>平台运营</option><option>系统管理员</option><option>订单审核员</option></select></label><label>状态<select><option>草稿</option><option>待审核</option><option>启用</option></select></label><label>说明<textarea>演示页面：支持查看、编辑、审核和保存操作。</textarea></label><div class="audit"><b>操作记录</b><p>2026-09-15 08:40 · 系统管理员打开记录</p><p>2026-09-14 16:20 · 平台运营提交审核</p></div></div><footer><button @click="drawer=''">取消</button><button class="primary" @click="save">保存</button></footer></div>
    <SecondaryPage v-if="detailPage" :page-key="detailPage" @close="detailPage=''" @action="notice=$event;detailPage=''" />
  </div>
</template>

<style scoped>
.capability-links{display:flex;gap:8px;padding:12px 0}.capability-links button{border:1px solid #cfd9e6;background:#fff;color:#315eae;padding:9px 13px}
.admin-shell{position:fixed;inset:0;z-index:70;background:#f2f4f7;color:#263142;display:grid;grid-template-columns:220px 1fr}.admin-shell>aside{background:#17243a;padding:0 12px;color:#bbc5d3}.admin-brand{height:84px;padding:16px 10px;box-sizing:border-box;border-bottom:1px solid #344156;margin-bottom:14px}.admin-brand b{float:left;background:#d9272e;color:#fff;width:38px;height:38px;display:grid;place-items:center;margin-right:10px}.admin-brand span,.admin-brand small{display:block}.admin-brand span{color:#fff;font-size:12px;font-weight:700}.admin-brand small{font-size:9px;margin-top:5px}.admin-shell aside>button{display:block;width:100%;border:0;background:none;color:inherit;text-align:left;padding:12px 18px;border-radius:3px}.admin-shell aside>button.active{background:#315eae;color:#fff}.admin-shell>main{overflow:auto;padding:0 28px 32px}.admin-shell main>header{height:84px;display:flex;align-items:center;justify-content:space-between}.admin-shell main>header span{font-size:10px;color:#8b95a2}.admin-shell h1{font-size:23px;margin:5px 0}.admin-shell button{border:1px solid #dbe1e8;background:#fff;padding:8px 13px}.admin-shell main>header button{margin-left:8px}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.metrics article,.toolbar,.data,.status-grid article{background:#fff;border:1px solid #e2e7ed;padding:18px}.metrics span,.metrics b,.metrics small{display:block}.metrics span{font-size:11px;color:#7c8795}.metrics b{font-size:26px;margin:8px 0}.metrics small{font-size:9px;color:#315eae}.toolbar{display:flex;justify-content:space-between;margin-top:14px}.toolbar input{padding:9px;border:1px solid #d9e0e8;width:240px}.primary{background:#315eae!important;color:#fff!important;border-color:#315eae!important}.data{margin-top:14px}.data-head{display:flex;justify-content:space-between;margin-bottom:14px}.data table{width:100%;border-collapse:collapse;font-size:12px}.data th,.data td{text-align:left;padding:12px;border-bottom:1px solid #e7ebf0}.data th{background:#f7f9fb;color:#7c8795}.data i{font-style:normal;color:#b45f18;background:#fff3e8;padding:4px 8px}.link{border:0!important;background:none!important;color:#315eae;padding:4px!important}.status-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}.status-grid p{display:flex;border-bottom:1px solid #e8ecf1;padding:9px}.status-grid p b,.status-grid p em{margin-left:auto}.status-grid em{color:#b45f18}.status-grid article div{display:grid;grid-template-columns:1fr 1fr;gap:8px}.notice{position:fixed;top:20px;left:50%;background:#17243a;color:#fff;padding:10px 20px;z-index:3}.drawer{position:fixed;right:0;top:0;bottom:0;width:min(480px,90vw);background:#fff;z-index:5;box-shadow:-12px 0 30px #17243a33;display:flex;flex-direction:column}.drawer header{display:flex;justify-content:space-between;padding:22px;border-bottom:1px solid #e2e7ed}.drawer h2{margin:4px 0}.drawer-body{padding:22px;overflow:auto}.drawer label{display:block;font-size:11px;color:#6d7886;margin-bottom:16px}.drawer input,.drawer select,.drawer textarea{display:block;width:100%;box-sizing:border-box;margin-top:6px;padding:10px;border:1px solid #d8e0e8}.drawer textarea{height:100px}.drawer footer{margin-top:auto;padding:18px;border-top:1px solid #e2e7ed;text-align:right}.drawer footer button{margin-left:8px}.audit{background:#f6f8fb;padding:15px}.audit p{font-size:10px;color:#7d8794}@media(max-width:800px){.admin-shell{grid-template-columns:150px 1fr}.admin-shell>main{padding:0 14px 24px}.metrics{grid-template-columns:1fr 1fr}.status-grid{grid-template-columns:1fr}.data{overflow-x:auto}.data table{min-width:680px}.toolbar{gap:10px}.toolbar input{width:130px}}
</style>
