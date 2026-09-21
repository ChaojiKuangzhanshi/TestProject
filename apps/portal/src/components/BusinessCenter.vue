<script setup lang="ts">
import { computed, ref } from 'vue'
import { allocatePlan, canCheckout, transitionOrder } from '../demo/workflows'
import { normalizePlatformName } from '../demo/platform-config'
import SecondaryPage from './SecondaryPage.vue'

const props = defineProps<{ initialTab: string; roleLabel: string }>()
defineEmits<{ close: [] }>()
const platformName = defineModel<string>('platformName', { required: true })

const active = ref(props.initialTab || 'overview')
const notice = ref('')
const detailPage = ref('')
const orderState = ref<'待提交' | '待审核' | '审核驳回' | '待客户确认' | '生产备货' | '待发货' | '已发货' | '已签收' | '已完成'>('待审核')
const planAmount = ref(1200)
const remainingQuota = 1000
const planResult = computed(() => allocatePlan(planAmount.value, remainingQuota))
const cartResult = canCheckout([
  { stock: '现货', active: true, quantity: 20, minimum: 10 },
  { stock: '库存紧张', active: true, quantity: 5, minimum: 5 }
])

const tabs = [
  ['overview', '业务总览'], ['demand', '需求协同'], ['cart', '采购车'], ['orders', '订单履约'],
  ['plans', '需求计划'], ['accounts', '企业与账号'], ['content', '内容运营'], ['platform', '平台配置']
]

const demands = [
  ['DEM-202609-031', '户外高亮屏定制需求', '待客户确认', '张工', '剩余 2小时'],
  ['DEM-202609-028', '智能音响套料选型', '处理中', '李工', '正常'],
  ['DEM-202609-024', '会议室显示方案咨询', '待受理', '待分派', '剩余 3小时']
]

const orders = [
  ['XY202609140018', '华中智显科技', '生产备货', '¥86,420', '2026-09-28'],
  ['XY202609130012', '信阳智造', '待客户确认', '¥32,680', '2026-09-25'],
  ['XY202609120008', '豫南科技', '已发货', '¥18,900', '2026-09-20']
]

function flash(message: string) {
  notice.value = message
  window.setTimeout(() => { notice.value = '' }, 2600)
}

function approveOrder() {
  try {
    orderState.value = transitionOrder(orderState.value, 'approve')
    flash(`订单已流转至“${orderState.value}”`)
  } catch (error) {
    flash((error as Error).message)
  }
}

function savePlatformConfig() {
  platformName.value = normalizePlatformName(platformName.value)
  flash('配置已保存并记录审计日志')
}

function openDetail(page: string) {
  detailPage.value = page
}

function completeDetail(message: string) {
  detailPage.value = ''
  flash(message)
}
</script>

<template>
  <div class="center-shell">
    <header class="center-header">
      <div><b>{{ platformName }}</b><span>企业业务中心 · {{ roleLabel }}</span></div>
      <button @click="$emit('close')">返回门户</button>
    </header>
    <aside class="center-nav">
      <div class="user-card"><span>{{ roleLabel.slice(0, 1) }}</span><div><b>{{ roleLabel }}</b><small>华中智显科技</small></div></div>
      <button v-for="tab in tabs" :key="tab[0]" :class="{ active: active === tab[0] }" @click="active = tab[0]">{{ tab[1] }}</button>
    </aside>
    <main class="center-main">
      <div v-if="notice" class="center-toast">{{ notice }}</div>

      <section v-if="active === 'overview'">
        <div class="page-title"><div><span>ENTERPRISE CENTER</span><h1>业务总览</h1><p>集中管理采购、需求、计划与企业资料。</p></div><button class="main-action" @click="active = 'demand'">新建需求</button></div>
        <div class="summary-grid"><article><span>待处理需求</span><b>6</b><small>1项即将超时</small></article><article><span>执行中订单</span><b>12</b><small>本月金额 ¥386,420</small></article><article><span>可用集采额度</span><b>68%</b><small>已占用 ¥320,000</small></article><article><span>未读消息</span><b>9</b><small>3条重要公告</small></article></div>
        <div class="panel-grid"><article class="wide-panel"><div class="panel-head"><h2>最近订单</h2><button @click="active = 'orders'">查看全部</button></div><table><thead><tr><th>订单编号</th><th>企业</th><th>状态</th><th>金额</th><th>预计交付</th></tr></thead><tbody><tr v-for="row in orders" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td><i class="status">{{ row[2] }}</i></td><td>{{ row[3] }}</td><td>{{ row[4] }}</td></tr></tbody></table></article><article><h2>快捷入口</h2><div class="quick-actions"><button @click="active = 'cart'">采购车结算<span>2 个组合</span></button><button @click="active = 'plans'">提报需求计划<span>2026 Q4</span></button><button @click="active = 'accounts'">企业资料<span>2 项即将到期</span></button><button @click="active = 'content'">重要公告<span>3 条未读</span></button></div></article></div>
      </section>

      <section v-else-if="active === 'demand'">
        <div class="page-title"><div><span>DEMAND COLLABORATION</span><h1>需求协同</h1><p>从需求提交、分派、方案版本到客户确认全程留痕。</p></div><div class="page-actions"><button @click="openDetail('lead-center')">我的咨询线索</button><button @click="openDetail('smart-match')">智能匹配</button><button class="main-action" @click="openDetail('demand-create')">新建需求</button></div></div>
        <div class="flow-strip"><b>待受理 <span>3</span></b><b>处理中 <span>6</span></b><b>待客户确认 <span>2</span></b><b>已完成 <span>18</span></b></div>
        <article class="data-panel"><div class="panel-head"><h2>需求工单</h2><div><button @click="flash('需求清单已导出')">导出</button><button @click="flash('筛选条件面板已展开')">筛选</button></div></div><table><thead><tr><th>工单编号</th><th>需求名称</th><th>状态</th><th>负责人</th><th>SLA</th><th>操作</th></tr></thead><tbody><tr v-for="row in demands" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td><i class="status">{{ row[2] }}</i></td><td>{{ row[3] }}</td><td>{{ row[4] }}</td><td><button class="link" @click="openDetail('demand-detail')">进入协同</button></td></tr></tbody></table></article>
        <div class="version-panel"><div><span class="version-badge">V2.1 当前版本</span><h3>户外高亮数字标牌定制方案</h3><p>相较 V2.0：亮度由 2,000nit 调整为 2,500nit，电源板更换为工业级 220W。</p></div><div><button @click="openDetail('version-compare')">版本对比</button><button class="main-action" @click="flash('方案 V2.1 已确认并锁定，可转采购车')">确认方案</button></div></div>
      </section>

      <section v-else-if="active === 'cart'">
        <div class="page-title"><div><span>PURCHASE CART</span><h1>采购车</h1><p>产品与方案组合统一结算，提交前复核价格和库存。</p></div></div>
        <article class="cart-group"><div class="cart-group-head"><div><b>户外高亮数字标牌方案</b><span>标准版 V3.2 · 销售主体：信扬科技</span></div><i>方案组合</i></div><div class="cart-line"><div class="part-art red"></div><div><b>65英寸户外高亮屏</b><span>必选 · XY-LCD-650H</span></div><strong>¥5,680</strong><label>数量 <input value="10" /></label><em>库存紧张</em></div><div class="cart-line"><div class="part-art blue"></div><div><b>安卓智能主控板 A73</b><span>可选 · XY-MB-A730</span></div><strong>¥528</strong><label>数量 <input value="10" /></label><em>现货</em></div></article>
        <article class="checkout-box"><div><span>校验结果</span><b>{{ cartResult.allowed ? '价格与库存校验通过' : cartResult.reasons.join('、') }}</b><small>将按销售主体、仓库和币种自动拆分为 1 个订单</small></div><div><span>企业协议价合计</span><strong>¥62,080</strong><button class="main-action" @click="openDetail('checkout')">提交结算</button></div></article>
      </section>

      <section v-else-if="active === 'orders'">
        <div class="page-title"><div><span>ORDER FULFILLMENT</span><h1>订单中心</h1><p>审核、确认、备货、发货和签收状态统一跟踪。</p></div><button class="main-action" @click="openDetail('order-create')">销售代客建单</button></div>
        <article class="order-focus"><div class="order-title"><div><span>订单 XY202609140018</span><h2>当前状态：{{ orderState }}</h2></div><button @click="approveOrder">审核通过</button></div><div class="order-timeline"><div class="done"><i></i><b>已提交</b><span>09-14 10:20</span></div><div class="current"><i></i><b>{{ orderState }}</b><span>等待处理</span></div><div><i></i><b>生产备货</b><span>待开始</span></div><div><i></i><b>待发货</b><span>待开始</span></div><div><i></i><b>已签收</b><span>待开始</span></div></div></article>
        <div class="panel-grid"><article class="wide-panel"><h2>订单列表</h2><table><thead><tr><th>订单编号</th><th>企业</th><th>状态</th><th>金额</th><th>预计交付</th><th>操作</th></tr></thead><tbody><tr v-for="row in orders" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td><i class="status">{{ row[2] }}</i></td><td>{{ row[3] }}</td><td>{{ row[4] }}</td><td><button class="link" @click="openDetail(row[2] === '已签收' ? 'order-evaluation' : 'order-detail')">{{ row[2] === '已签收' ? '评价' : '详情' }}</button></td></tr></tbody></table></article><article><h2>物流跟踪</h2><div class="shipment"><b>第 1 批 · 已签收</b><span>液晶屏 6 件</span><small>顺丰 SF1234567890</small></div><div class="shipment"><b>第 2 批 · 运输中</b><span>液晶屏 4 件、主控板 10 件</span><small>预计 09-20 到达</small></div><button class="link" @click="openDetail('order-evaluation')">演示签收后评价</button></article></div>
      </section>

      <section v-else-if="active === 'plans'">
        <div class="page-title"><div><span>DEMAND PLANNING</span><h1>需求计划与集采额度</h1><p>按月或季度提报计划，超额申请自动进入特殊审批。</p></div><button class="main-action" @click="openDetail('plan-import')">Excel 导入</button></div>
        <div class="quota-card"><div><span>2026 Q4 集采额度</span><b>¥1,000,000</b><small>已占用 ¥680,000 · 剩余 ¥320,000</small></div><div class="quota-bar"><i></i></div></div>
        <article class="plan-form"><h2>新建计划测算</h2><label>计划金额（千元）<input v-model.number="planAmount" type="number" /></label><div><span>普通占用</span><b>{{ planResult.occupied }} 千元</b></div><div><span>超额部分</span><b>{{ planResult.excess }} 千元</b></div><div><span>提交路径</span><i class="status">{{ planResult.status }}</i></div><button class="main-action" @click="flash(`计划已提交至“${planResult.status}”`) ">提交计划</button></article>
      </section>

      <section v-else-if="active === 'accounts'">
        <div class="page-title"><div><span>ENTERPRISE & IDENTITY</span><h1>企业与账号</h1><p>企业资料、资质、联系人、子账号和数据权限统一管理。</p></div><div class="page-actions"><button @click="openDetail('contact-center')">联系人</button><button @click="openDetail('password-security')">账号安全</button><button class="main-action" @click="openDetail('account-create')">新建子账号</button></div></div>
        <div class="summary-grid three"><article><span>企业状态</span><b class="small-value">审核通过</b><small>统一社会信用代码已验证</small></article><article><span>有效资质</span><b>6</b><small>2项将在30天内到期</small></article><article><span>企业账号</span><b>12</b><small>主账号1 · 子账号11</small></article></div>
        <div class="panel-grid"><article class="wide-panel"><h2>子账号与权限</h2><table><thead><tr><th>姓名</th><th>角色</th><th>数据范围</th><th>订单规则</th><th>状态</th></tr></thead><tbody><tr><td>王敏</td><td>采购子账号</td><td>本人数据</td><td>需主账号确认</td><td><i class="status">启用</i></td></tr><tr><td>陈晨</td><td>采购子账号</td><td>企业全部</td><td>可直接送审</td><td><i class="status">启用</i></td></tr><tr><td>刘洋</td><td>采购子账号</td><td>本人数据</td><td>需主账号确认</td><td><i class="status muted">已停用</i></td></tr></tbody></table></article><article><h2>资质提醒</h2><div class="credential"><b>ISO 9001 认证</b><span>30天后到期</span><button @click="openDetail('credential-update')">更新</button></div><div class="credential"><b>产品质量认证</b><span>7天后到期</span><button @click="openDetail('credential-update')">更新</button></div></article></div>
      </section>

      <section v-else-if="active === 'content'">
        <div class="page-title"><div><span>CONTENT OPERATIONS</span><h1>内容运营</h1><p>首页、公告、产品、方案、案例和平台资质统一发布。</p></div><button class="main-action" @click="openDetail('content-edit')">新建内容</button></div>
        <div class="content-modules"><button v-for="item in [['首页配置','content-edit'],['公告管理','content-edit'],['产品发布','product-publish'],['方案管理','content-edit'],['成功案例','content-edit'],['平台资质','qualification-center'],['批量上传','batch-upload'],['双语内容','i18n-preview']]" :key="item[0]" @click="openDetail(item[1])"><b>{{ item[0] }}</b><span>草稿 / 审核 / 发布 / 版本</span></button></div>
        <article class="data-panel"><div class="panel-head"><h2>待审核内容</h2><button @click="flash('已打开批量审核队列')">批量审核</button></div><table><thead><tr><th>内容类型</th><th>标题</th><th>提交人</th><th>计划发布时间</th><th>状态</th></tr></thead><tbody><tr><td>首页轮播</td><td>2026秋季企业解决方案</td><td>平台运营</td><td>09-15 09:00</td><td><i class="status">待审核</i></td></tr><tr><td>产品版本</td><td>65英寸户外高亮屏 V2</td><td>产品运营</td><td>审核后立即</td><td><i class="status">待审核</i></td></tr><tr><td>公告</td><td>国庆期间物流服务安排</td><td>平台运营</td><td>09-28 10:00</td><td><i class="status">待审核</i></td></tr></tbody></table></article>
      </section>

      <section v-else>
        <div class="page-title"><div><span>PLATFORM SETTINGS</span><h1>平台配置</h1><p>品牌、权限、流程、消息、Dify 和外部适配器集中配置。</p></div><button class="main-action" @click="savePlatformConfig">保存配置</button></div>
        <div class="settings-grid"><article><h2>门户基础配置</h2><label>平台名称<input v-model="platformName" /></label><label>服务专线<input value="400-800-9966" /></label><label>默认语言<select><option>中文</option><option>English</option></select></label><button class="link" @click="openDetail('i18n-preview')">预览中英文内容</button></article><article><h2>Dify 本地服务</h2><label>服务地址<input value="http://dify.internal/v1" /></label><label>应用 ID<input value="xinyang-assistant" /></label><label>API Key<input type="password" value="encrypted-key" /></label><div class="service-state"><i></i> 未连接 · 故障时转留言</div></article><article><h2>外部适配器与任务</h2><p><span>XTS Mock</span><b>正常</b></p><p><span>CRM Mock</span><b>正常</b></p><p><span>物流 Mock</span><b>正常</b></p><p><span>消息 Mock</span><b>正常</b></p><button class="link" @click="openDetail('import-export-center')">导入导出任务中心</button></article><article><h2>权限、流程与消息</h2><p><span>角色与菜单</span><b>9类角色</b></p><p><span>字段权限</span><b>已启用</b></p><p><span>Flowable 流程</span><b>6个已发布</b></p><p><span>审计日志</span><b>运行中</b></p><div class="setting-actions"><button @click="openDetail('permission-center')">权限策略</button><button @click="openDetail('workflow-designer')">流程设计</button><button @click="openDetail('message-center')">消息规则</button></div></article></div>
      </section>
    </main>
    <SecondaryPage v-if="detailPage" :page-key="detailPage" @close="detailPage = ''" @action="completeDetail" />
  </div>
</template>

<style scoped>
.page-actions,.setting-actions{display:flex;gap:8px}.page-actions button,.setting-actions button{border:1px solid #dce2e9;background:#fff;padding:9px 13px}.page-actions .main-action{border:0;background:#d9272e;color:#fff}
.center-shell{position:fixed;inset:0;z-index:65;background:#f1f4f8;color:#202b3a;display:grid;grid-template-columns:220px 1fr;grid-template-rows:68px 1fr;min-width:1024px}.center-header{grid-column:1/-1;background:#fff;border-bottom:1px solid #e1e6ed;display:flex;align-items:center;justify-content:space-between;padding:0 26px}.center-header b,.center-header span{display:block}.center-header b{font-size:17px}.center-header span{font-size:11px;color:#8792a1;margin-top:3px}.center-header button{border:1px solid #dbe1e8;background:#fff;padding:9px 18px}.center-nav{background:#18263b;padding:18px 12px}.user-card{display:flex;gap:10px;color:#fff;padding:10px 10px 22px;border-bottom:1px solid #314057;margin-bottom:14px}.user-card>span{width:36px;height:36px;border-radius:50%;background:#d9272e;display:flex;align-items:center;justify-content:center;font-weight:800}.user-card b,.user-card small{display:block}.user-card small{color:#9fabbc;font-size:10px;margin-top:4px}.center-nav>button{display:block;width:100%;border:0;background:none;color:#b8c2d0;text-align:left;padding:12px 18px;border-radius:4px}.center-nav>button.active,.center-nav>button:hover{background:#d9272e;color:#fff}.center-main{padding:30px;overflow:auto}.center-toast{position:fixed;left:55%;top:82px;transform:translateX(-50%);background:#17243a;color:#fff;padding:11px 22px;border-radius:4px;z-index:2}.page-title{display:flex;align-items:end;justify-content:space-between;margin-bottom:24px}.page-title span{font-size:10px;color:#d9272e;font-weight:800;letter-spacing:1.6px}.page-title h1{margin:5px 0;font-size:28px}.page-title p{margin:0;color:#7a8593;font-size:12px}.main-action{border:0;background:#d9272e;color:#fff;padding:10px 18px;border-radius:3px}.summary-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.summary-grid.three{grid-template-columns:repeat(3,1fr)}.summary-grid article,.data-panel,.wide-panel,.panel-grid>article,.order-focus,.cart-group,.checkout-box,.plan-form,.quota-card,.version-panel,.settings-grid article{background:#fff;border:1px solid #e2e7ed;padding:20px}.summary-grid span,.summary-grid b,.summary-grid small{display:block}.summary-grid span{font-size:11px;color:#7d8795}.summary-grid b{font-size:28px;margin:8px 0}.summary-grid b.small-value{font-size:20px}.summary-grid small{color:#929ba7;font-size:10px}.panel-grid{display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-top:14px}.panel-grid h2,.data-panel h2,.plan-form h2,.settings-grid h2{font-size:16px;margin:0 0 18px}.panel-head{display:flex;justify-content:space-between;align-items:center}.panel-head button{border:0;background:none;color:#315eae}.quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.quick-actions button,.content-modules button{border:1px solid #e0e5eb;background:#f8f9fb;text-align:left;padding:13px}.quick-actions b,.quick-actions span,.content-modules b,.content-modules span{display:block}.quick-actions span,.content-modules span{font-size:10px;color:#8b95a2;margin-top:5px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{text-align:left;border-bottom:1px solid #e7ebf0;padding:11px}th{color:#7c8795;background:#f7f9fb}.status{font-style:normal;color:#315eae;background:#edf3fc;padding:4px 8px;border-radius:10px;font-size:10px}.status.muted{color:#818b98;background:#eef0f3}.link{border:0;background:none;color:#d9272e}.flow-strip{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border:1px solid #e2e7ed;margin-bottom:14px}.flow-strip b{padding:18px;border-right:1px solid #e2e7ed}.flow-strip span{float:right;color:#d9272e}.version-panel{display:flex;justify-content:space-between;align-items:center;margin-top:14px;border-left:4px solid #315eae}.version-panel p{font-size:12px;color:#697583}.version-panel button{margin-left:8px;border:1px solid #dce2e9;background:#fff;padding:9px 14px}.version-panel button.main-action{background:#d9272e;color:#fff;border:0}.version-badge{font-size:10px;color:#315eae}.cart-group-head,.cart-line,.checkout-box,.order-title{display:flex;align-items:center}.cart-group-head{justify-content:space-between;border-bottom:1px solid #e5e9ee;padding-bottom:14px}.cart-group-head b,.cart-group-head span{display:block}.cart-group-head span{font-size:10px;color:#8b95a1;margin-top:4px}.cart-group-head i{font-style:normal;background:#fff0f0;color:#d9272e;padding:4px 8px;font-size:10px}.cart-line{gap:16px;padding:16px 0;border-bottom:1px solid #eef1f4}.cart-line>div:nth-child(2){flex:1}.cart-line b,.cart-line span{display:block}.cart-line span{font-size:10px;color:#8b95a1;margin-top:4px}.cart-line strong{width:90px;color:#d9272e}.cart-line label{font-size:11px}.cart-line input{width:48px;padding:5px;border:1px solid #dce2e9}.cart-line em{font-style:normal;font-size:10px;color:#b36a12}.part-art{width:48px;height:38px;background:#d9272e;box-shadow:7px 7px 0 #f2d9da}.part-art.blue{background:#315eae;box-shadow:7px 7px 0 #dbe4f4}.checkout-box{justify-content:space-between;margin-top:14px}.checkout-box span,.checkout-box b,.checkout-box small{display:block}.checkout-box span,.checkout-box small{font-size:10px;color:#84909e}.checkout-box b{margin:5px 0;color:#15916c}.checkout-box>div:last-child{text-align:right}.checkout-box strong{font-size:25px;color:#d9272e;margin:0 18px}.order-title{justify-content:space-between}.order-title span{font-size:11px;color:#7d8794}.order-title h2{font-size:20px}.order-title button{background:#315eae;color:#fff;border:0;padding:9px 15px}.order-timeline{display:grid;grid-template-columns:repeat(5,1fr);margin-top:28px}.order-timeline>div{position:relative;border-top:3px solid #dce1e7;padding-top:14px}.order-timeline>div.done,.order-timeline>div.current{border-color:#d9272e}.order-timeline i{position:absolute;top:-8px;width:13px;height:13px;border-radius:50%;background:#fff;border:3px solid #dce1e7}.order-timeline .done i,.order-timeline .current i{border-color:#d9272e}.order-timeline b,.order-timeline span{display:block;font-size:11px}.order-timeline span{color:#9099a5;margin-top:4px}.shipment,.credential{padding:12px 0;border-bottom:1px solid #e6eaf0}.shipment b,.shipment span,.shipment small,.credential b,.credential span{display:block}.shipment span,.shipment small,.credential span{font-size:10px;color:#88939f;margin-top:4px}.credential button{float:right;margin-top:-28px;border:0;background:none;color:#315eae}.quota-card{display:grid;grid-template-columns:260px 1fr;align-items:center}.quota-card span,.quota-card b,.quota-card small{display:block}.quota-card b{font-size:26px;margin:5px 0}.quota-card small{font-size:10px;color:#8c96a3}.quota-bar{height:12px;background:#edf0f4;border-radius:8px}.quota-bar i{display:block;width:68%;height:100%;background:linear-gradient(90deg,#315eae,#d9272e);border-radius:8px}.plan-form{margin-top:14px;display:grid;grid-template-columns:2fr repeat(3,1fr) auto;align-items:end;gap:15px}.plan-form label,.settings-grid label{font-size:11px;color:#788391}.plan-form input,.settings-grid input,.settings-grid select{display:block;width:100%;border:1px solid #dce2e8;padding:9px;margin-top:5px}.plan-form span,.plan-form b{display:block}.plan-form span{font-size:10px;color:#8c96a2}.content-modules{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.settings-grid label{display:block;margin:11px 0}.settings-grid article>p{display:flex;border-bottom:1px solid #e8ecf1;padding:10px 0;margin:0;font-size:12px}.settings-grid article>p b{margin-left:auto}.service-state{font-size:11px;color:#a96a14}.service-state i{display:inline-block;width:8px;height:8px;background:#f0a12d;border-radius:50%}@media(max-width:1180px){.center-main{padding:22px}.summary-grid{grid-template-columns:1fr 1fr}.panel-grid{grid-template-columns:1fr}.content-modules{grid-template-columns:repeat(2,1fr)}}
@media(max-width:800px){.center-shell{min-width:0;grid-template-columns:150px minmax(0,1fr);grid-template-rows:60px 1fr}.center-header{padding:0 14px}.center-header b{font-size:14px}.center-header button{padding:7px 10px}.center-nav{padding:12px 7px}.center-nav>button{padding:10px 11px;font-size:12px}.user-card{padding:8px 5px 15px}.user-card>span{width:30px;height:30px}.user-card b{font-size:12px}.center-main{padding:16px}.page-title{align-items:flex-start;gap:12px}.page-title h1{font-size:22px}.page-title p{font-size:11px}.summary-grid,.summary-grid.three,.flow-strip,.settings-grid,.content-modules{grid-template-columns:1fr}.panel-grid{grid-template-columns:1fr}.quota-card,.plan-form{grid-template-columns:1fr}.quota-bar{margin-top:15px}.wide-panel,.data-panel{overflow-x:auto}.order-timeline{grid-template-columns:repeat(5,120px);overflow-x:auto}.checkout-box{align-items:flex-start;gap:15px;flex-direction:column}.checkout-box>div:last-child{text-align:left}.checkout-box strong{margin-left:0}.cart-line{min-width:620px}.cart-group{overflow-x:auto}}
</style>
