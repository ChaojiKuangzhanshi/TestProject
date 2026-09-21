<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { capabilityCards, categories, demoRoles, filterProducts, navigationGroups, products, solutions, workspaceCards, type Product, type Solution } from './demo/model'
import BusinessCenter from './components/BusinessCenter.vue'
import SecondaryPage from './components/SecondaryPage.vue'
import AdminCenter from './components/AdminCenter.vue'
import { normalizePlatformName } from './demo/platform-config'

const activeRole = ref('visitor')
const search = ref('')
const showRoles = ref(false)
const showLogin = ref(false)
const showAdmin = ref(false)
const showAssistant = ref(false)
const showBusiness = ref(false)
const businessTab = ref('overview')
const secondaryPage = ref('')
const selectedItem = ref<Product | Solution | null>(null)
const activeCategory = ref('全部')
const pendingPage = ref('')
const pendingItem = ref<Product | Solution | null>(null)
const cartCount = ref(2)
const toast = ref('')
const platformName = ref(normalizePlatformName(window.localStorage.getItem('xinyang-platform-name')))

watch(platformName, value => window.localStorage.setItem('xinyang-platform-name', normalizePlatformName(value)))

const role = computed(() => demoRoles.find(item => item.key === activeRole.value) ?? demoRoles[0])
const isLoggedIn = computed(() => activeRole.value !== 'visitor')
const filteredProducts = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  const categoryProducts = filterProducts(products, activeCategory.value)
  if (!keyword) return categoryProducts
  return categoryProducts.filter(item => [item.name, item.code, item.category, ...item.specs].join(' ').toLowerCase().includes(keyword))
})

function go(target: string) {
  if (target === 'admin') { showAdmin.value = true; return }
  if (target === 'assistant') { showAssistant.value = true; return }
  const businessTargets = ['overview', 'demand', 'cart', 'orders', 'plans', 'accounts', 'content', 'platform']
  if (businessTargets.includes(target)) {
    businessTab.value = target
    showBusiness.value = true
    return
  }
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function notify(message: string) {
  toast.value = message
  window.setTimeout(() => { toast.value = '' }, 2400)
}

function openSecondary(page: string, item: Product | Solution | null = null) {
  secondaryPage.value = page
  selectedItem.value = item
}

function completeSecondary(message: string) {
  notify(message)
  secondaryPage.value = ''
}

function startDemand() {
  if (!isLoggedIn.value) {
    pendingPage.value = 'demand-create'
    showLogin.value = true
    notify('登录后继续填写需求工单')
    return
  }
  openSecondary('demand-create')
}

function buyProduct(product: Product) {
  if (!isLoggedIn.value) {
    showLogin.value = true
    notify(`登录后继续购买：${product.name}`)
    return
  }
  if (product.stock === '暂时缺货') {
    notify('当前商品缺货，已为你保留需求咨询入口')
    go('workspace')
    return
  }
  cartCount.value += 1
  notify(`${product.name} 已加入采购车`)
}

function buySolution(solution: Solution) {
  if (!isLoggedIn.value) {
    pendingPage.value = 'solution-checkout'
    pendingItem.value = solution
    showLogin.value = true
    notify(`登录后继续购买方案：${solution.name}`)
    return
  }
  openSecondary('solution-checkout', solution)
}

function selectRole(key: string) {
  activeRole.value = key
  showRoles.value = false
  showLogin.value = false
  notify(`已切换演示身份：${role.value.label}`)
  if (pendingPage.value) {
    openSecondary(pendingPage.value, pendingItem.value)
    pendingPage.value = ''
    pendingItem.value = null
  }
}
</script>

<template>
  <div class="app-shell">
    <div class="confidential">演示环境 · 数据均为模拟内容 · 当前版本覆盖一期功能</div>
    <header class="topbar">
      <button class="brand" @click="go('home')">
        <span class="brand-mark">XY</span>
        <span><b>{{ platformName }}</b><small>产业协同门户</small></span>
      </button>
      <div class="search-box">
        <span>产品 / 方案 / 物料编码 / 参数</span>
        <input v-model="search" aria-label="全局搜索" placeholder="输入关键词，例如：55英寸、主控板、户外方案" />
        <button @click="openSecondary('search-results')">搜索</button>
      </div>
      <div class="top-actions">
        <button class="text-button" @click="showRoles = !showRoles">
          <span class="avatar">{{ role.label.slice(0, 1) }}</span>
          {{ role.label }}
        </button>
        <button class="cart-button" @click="go('cart')">采购车 <b>{{ cartCount }}</b></button>
        <button class="lang" @click="notify('语言已切换：English（缺失内容自动回退中文）')">中 / EN</button>
      </div>
      <div v-if="showRoles" class="role-panel">
        <div class="role-panel-title">切换演示身份</div>
        <button v-for="item in demoRoles" :key="item.key" :class="{ active: item.key === activeRole }" @click="selectRole(item.key)">
          <b>{{ item.label }}</b><span>{{ item.description }}</span>
        </button>
      </div>
    </header>

    <nav class="main-nav">
      <div v-for="group in navigationGroups" :key="group.label" class="nav-group">
        <button v-for="item in group.items" :key="item.label" @click="go(item.target)">{{ item.label }}</button>
      </div>
      <span class="hotline">服务专线 400-800-9966</span>
    </nav>

    <main id="home">
      <section class="hero-wrap">
        <aside class="category-panel">
          <h2>全部产品分类</h2>
          <div v-for="category in categories" :key="category[0]" class="category-row">
            <b>{{ category[0] }}</b>
            <span>{{ category.slice(1).join(' · ') }}</span>
          </div>
        </aside>
        <div class="hero">
          <div class="hero-copy">
            <span class="eyebrow">XINYANG B2B SOLUTIONS</span>
            <h1>让产业采购与方案协同<br /><em>更清晰、更高效</em></h1>
            <p>从标准产品、套料方案到定制协同，一站完成选型、询单、采购与履约跟踪。</p>
            <div class="hero-buttons">
              <button class="primary" @click="go('solutions')">浏览行业方案</button>
              <button class="secondary" @click="startDemand">提交定制需求</button>
            </div>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="display-card large"><span>65″</span><small>4K 高亮显示</small></div>
            <div class="display-card small"><span>AIoT</span><small>智能控制套料</small></div>
            <div class="signal-ring"></div>
          </div>
          <div class="hero-stats">
            <div><b>1,000+</b><span>在库产品</span></div>
            <div><b>200+</b><span>标准方案</span></div>
            <div><b>30+</b><span>行业场景</span></div>
            <div><b>全流程</b><span>线上协同</span></div>
          </div>
        </div>
        <aside class="account-card">
          <div class="account-head"><span class="avatar large">{{ role.label.slice(0, 1) }}</span><div><b>{{ isLoggedIn ? role.label : '你好，欢迎访问' }}</b><small>{{ role.description }}</small></div></div>
          <button v-if="!isLoggedIn" class="primary wide" @click="showLogin = true">登录 / 企业注册</button>
          <div v-else class="signed-in">演示账号已登录<span>企业：华中智显科技</span></div>
          <div class="quick-grid">
            <button @click="go('demand')"><b>6</b><span>我的需求</span></button>
            <button @click="go('orders')"><b>12</b><span>我的订单</span></button>
            <button @click="go('news')"><b>3</b><span>未读消息</span></button>
            <button @click="showAssistant = true"><b>AI</b><span>智能客服</span></button>
          </div>
          <div class="notice-mini"><b>最新公告</b><p>中秋假期订单与物流服务安排</p><span>2026-09-12</span></div>
        </aside>
      </section>

      <section class="service-strip">
        <div v-for="(card, index) in capabilityCards" :key="card[0]"><span>0{{ index + 1 }}</span><div><b>{{ card[0] }}</b><small>{{ card[1] }}</small></div></div>
      </section>

      <section id="solutions" class="section">
        <div class="section-head"><div><span>INDUSTRY SOLUTIONS</span><h2>按场景选择成熟方案</h2></div><div><button @click="openSecondary('scenario-center')">场景筛选</button><button @click="openSecondary('smart-match')">智能匹配</button><button @click="openSecondary('solution-compare')">方案对比 →</button></div></div>
        <div class="solution-grid">
          <article v-for="solution in solutions" :key="solution.id" class="solution-card" :style="{ '--accent': solution.accent }" @click="openSecondary('solution-detail', solution)">
            <div class="solution-art"><span>{{ solution.scene }}</span><div class="art-lines"></div></div>
            <div class="solution-body"><small>{{ solution.version }}</small><h3>{{ solution.name }}</h3><p>{{ solution.highlight }}</p><ul><li v-for="item in solution.items" :key="item">{{ item }}</li></ul><div class="price-row"><span>方案价 <b>¥{{ solution.price.toLocaleString() }}</b></span><button @click.stop="buySolution(solution)">整套购买</button></div></div>
          </article>
        </div>
      </section>

      <section id="products" class="section products-section">
        <div class="section-head"><div><span>RECOMMENDED PRODUCTS</span><h2>{{ search ? `“${search}”的搜索结果` : '为你推荐' }}</h2></div><span class="result-count">{{ filteredProducts.length }} 个产品</span></div>
        <div class="filter-tabs"><button v-for="category in ['全部','液晶显示','板卡套料','音响器件','智能硬件']" :key="category" :class="{ active: activeCategory === category }" @click="activeCategory = category">{{ category }}</button></div>
        <div class="product-grid">
          <article v-for="product in filteredProducts" :key="product.id" class="product-card" @click="openSecondary('product-detail', product)">
            <div class="product-art" :style="{ '--accent': product.accent }"><div class="product-shape"></div><span>{{ product.category }}</span></div>
            <div class="stock" :class="{ danger: product.stock === '暂时缺货', warning: product.stock === '库存紧张' }">{{ product.stock }}</div>
            <h3>{{ product.name }}</h3><code>{{ product.code }}</code>
            <p class="specs">{{ product.specs.join(' · ') }}</p>
            <div class="product-bottom"><div><small>{{ product.agreementPrice && isLoggedIn ? '企业协议价' : '公开价' }}</small><b>¥{{ (product.agreementPrice && isLoggedIn ? product.agreementPrice : product.price).toLocaleString() }}</b></div><button @click.stop="buyProduct(product)">+</button></div>
          </article>
        </div>
      </section>

      <section id="workspace" class="section workspace-section">
        <div class="workspace-copy"><span>ENTERPRISE WORKSPACE</span><h2>一个工作台，掌握需求与交付</h2><p>需求提交、方案协同、订单审核、物流跟踪和需求计划都在统一上下文中完成。</p><button class="primary" @click="startDemand">新建需求工单</button></div>
        <div class="workspace-dashboard">
          <div v-for="card in workspaceCards" :key="card.title" class="metric-card" :class="card.tone"><span>{{ card.title }}</span><b>{{ card.value }}</b><small>{{ card.meta }}</small></div>
          <div class="timeline-card"><div class="timeline-head"><b>订单 XY202609140018</b><span>生产备货</span></div><div class="timeline"><i class="done"></i><i class="done"></i><i class="active"></i><i></i><i></i></div><div class="timeline-labels"><span>已审核</span><span>已确认</span><span>生产备货</span><span>待发货</span><span>签收</span></div></div>
        </div>
      </section>

      <section id="news" class="section news-section">
        <div class="section-head"><div><span>TRUST & INSIGHTS</span><h2>行业洞察与成功实践</h2></div><button @click="openSecondary('news-list')">查看全部内容 →</button></div>
        <div class="news-grid"><article class="featured-news"><span>客户案例</span><h3>从线下选型到线上协同，显示设备方案交付周期缩短</h3><p>围绕产品标准化、方案版本和订单状态，建立客户与工程团队的统一协作入口。</p></article><article><span>行业资讯</span><h3>商用显示供应链的标准化选型趋势</h3><p>参数模板和替代物料映射正在提升采购响应速度。</p></article><article><span>平台公告</span><h3>企业协议价格展示规则更新说明</h3><p>登录后将优先展示当前企业有效协议价。</p></article></div>
      </section>

      <section class="trust-bar"><button @click="openSecondary('qualification-center')"><b>平台资质</b><span>证书与认证在线查验</span></button><div><b>企业专价</b><span>公开价与协议价清晰标识</span></div><div><b>方案直购</b><span>标准套料一键加入采购车</span></div><div><b>全程可视</b><span>审核到签收状态跟踪</span></div></section>
    </main>

    <footer><div class="footer-brand"><span class="brand-mark">XY</span><div><b>{{ platformName }}</b><p>让产业采购与方案协同更高效</p></div></div><div><b>采购服务</b><span>产品中心</span><span>解决方案</span><span>需求提交</span></div><div><b>企业服务</b><span>企业注册</span><span>订单中心</span><span>需求计划</span></div><div><b>联系我们</b><span>400-800-9966</span><span>工作日 9:00–18:00</span><span>service@example.com</span></div></footer>

    <button class="assistant-fab" @click="showAssistant = true"><b>AI</b><span>智能客服</span></button>
    <div v-if="toast" class="toast">{{ toast }}</div>

    <div v-if="showLogin" class="modal-backdrop" @click.self="showLogin = false"><div class="login-modal"><button class="close" @click="showLogin = false">×</button><span class="eyebrow">DEMO ACCOUNT</span><h2>选择身份进入演示</h2><p>登录后将返回当前采购上下文。以下账号均为模拟数据。</p><div class="login-links"><button @click="showLogin=false;openSecondary('enterprise-register')">企业注册</button><button @click="showLogin=false;openSecondary('password-security')">忘记/修改密码</button></div><div class="login-role-grid"><button v-for="item in demoRoles.slice(1)" :key="item.key" @click="selectRole(item.key)"><b>{{ item.label }}</b><span>{{ item.description }}</span></button></div></div></div>


    <div v-if="showAssistant" class="assistant-panel"><div class="assistant-head"><div><b>信扬智能客服</b><span>Dify 本地服务 · 演示模式</span></div><button @click="showAssistant = false">×</button></div><div class="chat-body"><div class="bot-message">你好，我可以帮助你查询产品参数、匹配行业方案或解释平台操作。</div><div class="suggestions"><button @click="notify('正在匹配户外显示方案')">帮我匹配户外显示方案</button><button @click="notify('已定位订单状态说明')">订单状态是什么意思？</button><button @click="notify('已转为留言咨询')">转人工咨询</button></div></div><div class="chat-input"><input placeholder="输入你的问题" /><button @click="notify('Dify 演示回复已生成')">发送</button></div></div>

    <BusinessCenter v-if="showBusiness" v-model:platform-name="platformName" :initial-tab="businessTab" :role-label="role.label" @close="showBusiness = false" />
    <AdminCenter v-if="showAdmin" :platform-name="platformName" @close="showAdmin = false" />
    <SecondaryPage v-if="secondaryPage" :page-key="secondaryPage" :item="selectedItem" :keyword="search" @close="secondaryPage = ''" @action="completeSecondary" />
  </div>
</template>

<style scoped>
.section-head>div:last-child button{border:0;background:none;color:#596575;padding:7px 10px}.trust-bar>button{border:0;border-right:1px solid var(--line);background:#fff;text-align:left;padding:14px 30px}.trust-bar>button b,.trust-bar>button span{display:block}.trust-bar>button span{font-size:11px;color:#7c8693;margin-top:5px}.login-links{display:flex;gap:10px;margin:16px 0}.login-links button{border:1px solid var(--red);background:#fff;color:var(--red);padding:9px 14px;border-radius:4px}
</style>
