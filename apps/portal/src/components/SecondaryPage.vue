<script setup lang="ts">
import { computed, ref } from 'vue'
import { products, solutions, type Product, type Solution } from '../demo/model'
import { getSecondaryPage } from '../demo/page-registry'
import WizardForm from './WizardForm.vue'
import CapabilityDetail from './CapabilityDetail.vue'
import { capabilityPageKeys } from '../demo/capability-pages'

const props = defineProps<{ pageKey: string; item?: Product | Solution | null; keyword?: string }>()
const emit = defineEmits<{ close: []; action: [message: string] }>()
const currentKey = ref(props.pageKey)
const history = ref<string[]>([])
const selectedNews = ref('')
const page = computed(() => getSecondaryPage(currentKey.value))
const quantity = ref(10)
const compareRows = [
  ['适用场景', '户外商业', '派对娱乐', '智慧办公'], ['方案价格', '¥8,680', '¥3,980', '¥6,290'],
  ['核心产品数', '3', '3', '3'], ['交付周期', '14天', '7天', '10天'], ['亮点', '2500nit / IP65', 'DSP / 远场拾音', '4K / 无线投屏']
]
const newsItems = [
  { type: '平台公告', title: '中秋假期订单与物流服务安排', date: '2026-09-12', summary: '假期期间平台正常受理订单，部分仓库和物流线路将调整发运时效。' },
  { type: '行业资讯', title: '商用显示供应链的标准化选型趋势', date: '2026-09-10', summary: '标准参数模板和替代物料映射正在提升采购响应速度。' },
  { type: '规则说明', title: '企业协议价格展示规则更新说明', date: '2026-09-08', summary: '登录后优先展示当前企业有效协议价，未登录访客可查看公开价。' },
  { type: '产品动态', title: '户外商显方案升级至 V3.2', date: '2026-09-05', summary: '新版方案升级高亮屏和工业级电源配置，支持整套直接购买。' }
]

function openNested(key: string) {
  history.value.push(currentKey.value)
  currentKey.value = key
}

function goBack() {
  const previous = history.value.pop()
  if (previous) currentKey.value = previous
  else emit('close')
}

function readNews(title: string) {
  selectedNews.value = title
  openNested('news-detail')
}

</script>

<template>
  <div class="detail-shell">
    <header><div><span>{{ page.eyebrow }}</span><h1>{{ page.title }}</h1></div><button @click="goBack">返回上一级</button></header>
    <main>
      <template v-if="currentKey === 'product-detail' && item">
        <div class="product-detail"><div class="detail-art"><span>{{ (item as Product).category }}</span><b>{{ (item as Product).code }}</b></div><div><i>现货产品 · 版本 V2.3</i><h2>{{ item.name }}</h2><p>{{ (item as Product).specs.join(' · ') }}</p><div class="price"><small>公开价</small>¥{{ (item as Product).price.toLocaleString() }}</div><label>采购数量 <input v-model.number="quantity" type="number" min="1" /></label><div class="actions"><button @click="$emit('action', `${item.name} 已加入采购车`) ">加入采购车</button><button class="outline" @click="openNested('product-consultation')">需求咨询</button></div></div></div>
        <section><h3>规格参数</h3><div class="spec-grid"><p><span>产品编码</span><b>{{ (item as Product).code }}</b></p><p><span>库存状态</span><b>{{ (item as Product).stock }}</b></p><p v-for="spec in (item as Product).specs" :key="spec"><span>技术参数</span><b>{{ spec }}</b></p></div></section>
      </template>
      <template v-else-if="currentKey === 'solution-detail' && item">
        <div class="solution-hero"><div><i>{{ (item as Solution).scene }} · {{ (item as Solution).version }}</i><h2>{{ item.name }}</h2><p>{{ (item as Solution).highlight }}</p></div><strong>¥{{ (item as Solution).price.toLocaleString() }}</strong></div>
        <section><h3>方案组成</h3><div class="solution-lines"><div v-for="(part,index) in (item as Solution).items" :key="part"><b>0{{ index + 1 }}</b><span>{{ part }}</span><i>{{ index === 0 ? '必选' : '可调整' }}</i></div></div></section><div class="bottom-action"><button @click="openNested('solution-checkout')">整套购买</button><button class="outline" @click="openNested('demand-create')">基于此方案定制</button></div>
      </template>
      <template v-else-if="currentKey === 'solution-compare'">
        <section><h3>三套热门方案横向对比</h3><table><thead><tr><th>对比项</th><th v-for="item in solutions" :key="item.id">{{ item.name }}</th></tr></thead><tbody><tr v-for="row in compareRows" :key="row[0]"><th>{{ row[0] }}</th><td>{{ row[1] }}</td><td>{{ row[2] }}</td><td>{{ row[3] }}</td></tr></tbody></table></section>
      </template>
      <template v-else-if="currentKey === 'search-results'">
        <div class="filter"><b>“{{ keyword || '全部' }}”的搜索结果</b><button>产品 {{ products.length }}</button><button>方案 {{ solutions.length }}</button><button>资讯 3</button></div><section><div class="result-list"><article v-for="item in products.slice(0,5)" :key="item.id"><span>{{ item.category }}</span><div><h3>{{ item.name }}</h3><p>{{ item.code }} · {{ item.specs.join(' / ') }}</p></div><b>¥{{ item.price.toLocaleString() }}</b></article></div></section>
      </template>
      <template v-else-if="currentKey === 'news-list'">
        <div class="news-list"><article v-for="news in newsItems" :key="news.title"><span>{{ news.type }} · {{ news.date }}</span><h2>{{ news.title }}</h2><p>{{ news.summary }}</p><button @click="readNews(news.title)">阅读全文</button></article></div>
      </template>
      <template v-else-if="currentKey === 'news-detail'">
        <article class="article-page"><div class="article-meta">平台公告 · 2026-09-12 · 信扬供应链服务平台</div><h2>{{ selectedNews }}</h2><p class="lead">尊敬的企业客户：为保障节日期间采购与履约安排顺利进行，现将平台服务时间和物流安排说明如下。</p><h3>一、平台服务安排</h3><p>门户浏览、产品与方案查询、需求提交及订单查询全天正常开放。人工需求响应时间为工作日 9:00–18:00，紧急事项可通过服务专线留言。</p><h3>二、仓储与物流安排</h3><p>华中仓正常出库，跨区域干线运输可能延迟 1–2 个工作日。订单详情将展示每批发货数量、承运商、运单号和预计送达时间。</p><h3>三、订单与售后</h3><p>已确认交期的订单按约定执行；新提交订单以审核后的交付日期为准。如需调整收货计划，请在订单进入待发货前提交变更申请。</p><div class="article-files"><b>相关附件</b><button @click="$emit('action','附件《假期物流线路安排.pdf》已下载')">假期物流线路安排.pdf</button></div><footer><span>阅读量 286</span><button @click="$emit('action','公告已收藏')">收藏公告</button></footer></article>
      </template>
      <template v-else-if="currentKey === 'product-consultation'">
        <WizardForm :page-key="currentKey" :item="item" @cancel="goBack" @complete="$emit('action', $event)" />
      </template>
      <template v-else-if="currentKey === 'solution-checkout' && item">
        <WizardForm :page-key="currentKey" :item="item" @cancel="goBack" @complete="$emit('action', $event)" />
      </template>
      <template v-else-if="currentKey === 'demand-success'">
        <section class="success-page"><i>✓</i><h2>需求工单已提交</h2><p>工单编号 DEM-202609-034，预计 4 小时内由方案工程师响应。</p><div><b>当前状态</b><span>待受理</span><b>通知方式</b><span>站内消息 + 短信</span><b>下一步</b><span>平台分派负责人并确认需求参数</span></div><button @click="$emit('action','已进入需求工单 DEM-202609-034')">查看需求详情</button></section>
      </template>
      <template v-else-if="capabilityPageKeys.includes(currentKey)">
        <CapabilityDetail :page-key="currentKey" @action="$emit('action', $event)" />
      </template>
      <template v-else>
        <section v-if="currentKey === 'version-compare'" class="form-page"><h2>{{ page.title }}</h2><div class="diff"><p><span>参数</span><b>V2.0</b><b>V2.1 当前</b></p><p><span>屏幕亮度</span><del>2000nit</del><ins>2500nit</ins></p><p><span>电源板</span><del>标准 180W</del><ins>工业级 220W</ins></p></div></section>
        <WizardForm v-else :page-key="currentKey" :item="item" @cancel="goBack" @complete="$emit('action', $event)" />
      </template>
    </main>
  </div>
</template>

<style scoped>
.detail-shell{position:fixed;inset:0;z-index:90;background:#f3f5f8;color:#1d2939;overflow:auto}.detail-shell header{height:76px;background:#fff;border-bottom:1px solid #e2e7ed;padding:0 max(24px,calc((100% - 1180px)/2));display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:2}.detail-shell header span{font-size:10px;letter-spacing:1.6px;color:#d9272e;font-weight:800}.detail-shell h1{font-size:22px;margin:5px 0}.detail-shell header button,.outline{border:1px solid #d9e0e8;background:#fff;padding:9px 16px}.detail-shell main{max-width:1180px;margin:0 auto;padding:34px 24px}.product-detail{display:grid;grid-template-columns:1fr 1fr;gap:42px;background:#fff;padding:36px}.detail-art{height:340px;background:linear-gradient(145deg,#eef2f7,#d8e0eb);display:flex;flex-direction:column;align-items:center;justify-content:center}.detail-art span{font-size:28px}.detail-art b{margin-top:12px;color:#7d8998}.product-detail i,.solution-hero i{font-style:normal;color:#d9272e;font-size:11px}.product-detail h2,.solution-hero h2{font-size:30px;margin:12px 0}.product-detail p,.solution-hero p{color:#6e7987}.price{font-size:30px;color:#d9272e;font-weight:800;margin:28px 0}.price small{display:block;font-size:11px;color:#8b95a1}.product-detail label{display:block}.product-detail input{width:90px;padding:10px;margin-left:10px}.actions,.bottom-action{display:flex;gap:10px;margin-top:24px}.actions button,.bottom-action button,.form-actions button{border:0;background:#d9272e;color:#fff;padding:11px 22px}.actions .outline,.bottom-action .outline,.form-actions .outline{background:#fff;color:#344054;border:1px solid #d9e0e8}section{background:#fff;padding:26px;margin-top:16px}section h3{margin-top:0}.spec-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#e4e8ee}.spec-grid p{background:#fff;margin:0;padding:15px}.spec-grid span,.spec-grid b{display:block}.spec-grid span{font-size:10px;color:#87919e}.solution-hero{min-height:250px;background:linear-gradient(120deg,#16263c,#315eae);color:#fff;padding:44px;display:flex;align-items:center;justify-content:space-between}.solution-hero p{color:#cbd5e4}.solution-hero strong{font-size:34px}.solution-lines>div{display:grid;grid-template-columns:70px 1fr 80px;padding:16px;border-bottom:1px solid #e7ebf0}.solution-lines b{color:#d9272e}.solution-lines i{font-style:normal;font-size:10px}.detail-shell table{width:100%;border-collapse:collapse}.detail-shell th,.detail-shell td{padding:16px;border:1px solid #e2e7ed;text-align:left}.detail-shell thead{background:#18263b;color:#fff}.filter{display:flex;gap:10px;align-items:center}.filter b{margin-right:auto;font-size:20px}.filter button{border:1px solid #dae1e8;background:#fff;padding:9px 15px}.result-list article{display:flex;align-items:center;gap:18px;padding:18px;border-bottom:1px solid #e6ebf0}.result-list article>span{background:#edf3fc;color:#315eae;padding:6px 10px}.result-list article div{flex:1}.result-list h3,.result-list p{margin:4px 0}.result-list p{font-size:11px;color:#7d8794}.news-list{display:grid;grid-template-columns:1fr 1fr;gap:16px}.news-list article{background:#fff;padding:26px}.news-list span{color:#d9272e;font-size:10px}.news-list p{color:#6f7b89}.news-list button{border:0;background:none;color:#315eae}.form-page{max-width:850px;margin:0 auto}.steps{display:grid;grid-template-columns:repeat(3,1fr);margin-bottom:30px}.steps b{border-top:3px solid #d9dfe7;padding-top:10px;color:#8b95a2}.steps b.active{border-color:#d9272e;color:#d9272e}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.form-grid label{font-size:11px;color:#667282}.form-grid input,.form-grid textarea{display:block;width:100%;box-sizing:border-box;border:1px solid #d8e0e8;padding:11px;margin-top:6px}.form-grid textarea{height:100px}.form-grid .wide{grid-column:1/-1}.upload{border:1px dashed #aeb9c6;padding:20px}.upload span{display:block;margin-top:8px}.form-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}.diff p{display:grid;grid-template-columns:1fr 1fr 1fr;padding:14px;border-bottom:1px solid #e3e8ee}.diff del{color:#9b5960}.diff ins{color:#168467;text-decoration:none;font-weight:700}@media(max-width:760px){.product-detail,.news-list,.form-grid{grid-template-columns:1fr}.detail-art{height:220px}.form-grid .wide{grid-column:auto}.solution-hero{align-items:flex-start;flex-direction:column}.spec-grid{grid-template-columns:1fr}.detail-shell main{padding:20px 14px}.filter{flex-wrap:wrap}}
.article-page{max-width:850px;margin:0 auto;background:#fff;padding:46px 60px}.article-meta{font-size:11px;color:#8a95a3;border-bottom:1px solid #e5e9ee;padding-bottom:18px}.article-page h2{font-size:30px;margin:24px 0}.article-page .lead{font-size:16px;color:#465466;line-height:1.9}.article-page p{line-height:1.9;color:#5e6a79}.article-files{background:#f5f7fa;padding:16px;margin-top:28px}.article-files b{display:block;margin-bottom:10px}.article-files button{border:0;background:none;color:#315eae}.article-page footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e4e8ed;margin-top:28px;padding-top:18px;color:#88939f}.article-page footer button{border:1px solid #d9e0e8;background:#fff;padding:8px 15px}.context-card{background:#f1f5fb;border-left:4px solid #315eae;padding:18px;margin-bottom:22px}.context-card span,.context-card b,.context-card small{display:block}.context-card span,.context-card small{font-size:11px;color:#748090}.context-card b{font-size:18px;margin:6px 0}.form-grid select,.checkout-page input,.checkout-page select{display:block;width:100%;box-sizing:border-box;border:1px solid #d8e0e8;padding:11px;margin-top:6px}.checkout-page{max-width:920px;margin:0 auto}.checkout-columns{display:grid;grid-template-columns:1.4fr 1fr;gap:28px}.checkout-columns label{display:block;font-size:11px;color:#667282;margin:14px 0}.checkout-columns aside{background:#17243a;color:#fff;padding:24px}.checkout-columns aside p,.checkout-columns aside strong{display:flex;justify-content:space-between}.checkout-columns aside p{font-size:12px;color:#c6cfdb;border-bottom:1px solid #344156;padding-bottom:12px}.checkout-columns aside strong{font-size:20px;margin-top:26px}.checkout-columns aside small{display:block;color:#9fabba;margin-top:12px}.success-page{max-width:650px;margin:50px auto;text-align:center;padding:50px}.success-page>i{display:grid;place-items:center;width:64px;height:64px;margin:0 auto;background:#168467;color:#fff;border-radius:50%;font-size:32px;font-style:normal}.success-page h2{font-size:28px}.success-page>div{display:grid;grid-template-columns:120px 1fr;text-align:left;background:#f5f7fa;padding:20px;gap:12px;margin:28px 0}.success-page>div b{color:#718090}.success-page button{border:0;background:#d9272e;color:#fff;padding:11px 22px}@media(max-width:760px){.article-page{padding:28px 22px}.checkout-columns{grid-template-columns:1fr}}
</style>
