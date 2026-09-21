<script setup lang="ts">
import { computed, ref } from 'vue'
import { getCapabilityPage } from '../demo/capability-pages'

const props = defineProps<{ pageKey: string }>()
const emit = defineEmits<{ action: [message: string] }>()
const page = computed(() => getCapabilityPage(props.pageKey))
const selectedAction = ref('')

function run(action: string) {
  selectedAction.value = action
  emit('action', `${action}：${page.value.result}`)
}
</script>

<template>
  <div v-if="page" class="capability-page">
    <section class="capability-hero"><div><i>{{ page.status }}</i><h2>{{ page.summary }}</h2><p>此页面用于演示一期业务规则、操作状态和结果反馈，数据均为模拟内容。</p></div><b>{{ page.metrics[0][1] }}</b></section>
    <section class="capability-metrics"><article v-for="metric in page.metrics" :key="metric[0]"><span>{{ metric[0] }}</span><b>{{ metric[1] }}</b></article></section>
    <div class="capability-grid">
      <section class="control-panel"><h3>业务参数</h3><label v-for="control in page.controls" :key="control.label">{{ control.label }}
        <select v-if="control.options"><option v-for="option in control.options" :key="option" :selected="option === control.value">{{ option }}</option></select>
        <input v-else :value="control.value" />
      </label><div class="capability-actions"><button v-for="action in page.actions" :key="action" :class="{ primary: action === page.actions.at(-1) }" @click="run(action)">{{ action }}</button></div>
      <p v-if="selectedAction" class="inline-result">✓ 已执行“{{ selectedAction }}”，{{ page.result }}</p></section>
      <section class="record-panel"><h3>状态与记录</h3><article v-for="record in page.records" :key="record.title"><div><b>{{ record.title }}</b><span>{{ record.meta }}</span></div><i>{{ record.state }}</i></article><div class="audit"><b>审计记录</b><span>2026-09-15 10:42 · 演示用户 · 查看/操作已留痕</span></div></section>
    </div>
  </div>
</template>

<style scoped>
.capability-page{max-width:1040px;margin:0 auto}.capability-page section{margin-top:0}.capability-hero{background:linear-gradient(120deg,#17263b,#315eae);color:#fff;display:flex;justify-content:space-between;align-items:center;padding:34px}.capability-hero i{font-style:normal;font-size:10px;background:#ffffff22;padding:6px 10px}.capability-hero h2{font-size:24px;max-width:720px;line-height:1.45}.capability-hero p{color:#cad5e4;font-size:12px}.capability-hero>b{font-size:36px}.capability-metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#dde3ea;padding:1px}.capability-metrics article{background:#fff;padding:18px}.capability-metrics span,.capability-metrics b{display:block}.capability-metrics span{font-size:10px;color:#7c8794}.capability-metrics b{font-size:20px;margin-top:7px}.capability-grid{display:grid;grid-template-columns:1fr 1.25fr;gap:16px;margin-top:16px}.control-panel label{display:block;font-size:11px;color:#687587;margin-bottom:15px}.control-panel input,.control-panel select{display:block;width:100%;box-sizing:border-box;padding:10px;border:1px solid #d8e0e8;margin-top:6px;background:#fff}.capability-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}.capability-actions button{border:1px solid #d6dee8;background:#fff;padding:9px 14px}.capability-actions .primary{background:#d9272e;color:#fff;border-color:#d9272e}.inline-result{background:#edf8f4;color:#15775c;padding:12px;font-size:11px}.record-panel>article{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e6ebf0;padding:15px 0}.record-panel b,.record-panel span{display:block}.record-panel span{font-size:10px;color:#7d8997;margin-top:5px}.record-panel i{font-style:normal;color:#315eae;background:#edf3fc;padding:5px 9px;font-size:10px}.audit{background:#f5f7fa;padding:14px;margin-top:18px}.audit span{margin-top:6px}@media(max-width:760px){.capability-grid,.capability-metrics{grid-template-columns:1fr}.capability-hero{align-items:flex-start;flex-direction:column}.capability-hero>b{margin-top:18px}}
</style>
