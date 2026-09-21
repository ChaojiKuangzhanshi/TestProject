<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Product, Solution } from '../demo/model'
import { getWizardDefinition } from '../demo/wizard'

const props = defineProps<{ pageKey: string; item?: Product | Solution | null }>()
const emit = defineEmits<{ cancel: []; complete: [message: string] }>()
const definition = computed(() => getWizardDefinition(props.pageKey))
const step = ref(1)
const values = reactive<Record<string, string | number>>({})

function initialize() {
  step.value = 1
  for (const current of definition.value.steps) {
    for (const field of current.fields) values[field.key] = field.value ?? ''
  }
  if (props.item?.name) values.name = props.item.name
}

watch(() => props.pageKey, initialize, { immediate: true })
const current = computed(() => definition.value.steps[step.value - 1])
const reviewValues = computed(() => definition.value.steps.slice(0, 2).flatMap(item => item.fields).filter(item => item.type !== 'file').map(item => ({ label: item.label, value: values[item.key] || '未填写' })))

function previous() {
  if (step.value === 1) emit('cancel')
  else step.value--
}

function next() {
  if (step.value < 3) step.value++
  else step.value = 4
}

function handleResult(label: string) {
  if (label.includes('继续')) initialize()
  else emit('complete', `${definition.value.result.reference} · ${label}`)
}
</script>

<template>
  <section class="wizard">
    <div class="wizard-steps"><div v-for="(item,index) in definition.steps" :key="item.title" :class="{active:step===index+1,done:step>index+1}"><i>{{ step>index+1?'✓':index+1 }}</i><span><b>{{ item.title }}</b><small>{{ item.description }}</small></span></div></div>
    <div class="wizard-card">
      <div class="wizard-title"><span>STEP {{ step }} / 4</span><h2>{{ current.title }}</h2><p>{{ current.description }}</p></div>

      <div v-if="current.kind==='form'" class="wizard-fields">
        <label v-for="field in current.fields" :key="field.key" :class="{wide:field.wide,upload:field.type==='file'}"><span>{{ field.label }}</span>
          <select v-if="field.type==='select'" v-model="values[field.key]"><option v-for="option in field.options" :key="option">{{ option }}</option></select>
          <textarea v-else-if="field.type==='textarea'" v-model="values[field.key]"></textarea>
          <input v-else-if="field.type==='file'" type="file" :multiple="pageKey==='batch-upload'" />
          <input v-else v-model="values[field.key]" :type="field.type" />
          <small v-if="field.help">{{ field.help }}</small>
        </label>
      </div>

      <div v-else-if="current.kind==='review'" class="review-panel">
        <div class="review-context"><span>业务类型</span><b>{{ definition.title }}</b><span v-if="item">关联对象</span><b v-if="item">{{ item.name }}</b></div>
        <dl><div v-for="row in reviewValues" :key="row.label"><dt>{{ row.label }}</dt><dd>{{ row.value }}</dd></div></dl>
        <div class="rule-check"><b>✓ 业务规则校验通过</b><p>必填信息完整，权限、状态和数据范围校验通过。提交后将生成业务编号并发送站内通知。</p></div>
      </div>

      <div v-else class="wizard-result"><i>✓</i><h2>{{ definition.result.message }}</h2><p class="reference">{{ definition.result.reference }}</p><div><span>当前状态</span><b>{{ definition.result.status }}</b><span>提交时间</span><b>2026-09-15 09:20</b><span>后续处理</span><b>相关负责人将在待办中心收到通知</b></div><section><h3>可继续执行</h3><button v-for="action in definition.result.actions" :key="action" @click="handleResult(action)">{{ action }}</button></section></div>

      <footer v-if="current.kind!=='result'"><button class="back" @click="previous">{{ step===1?'取消':'上一步' }}</button><span>表单内容仅用于 Demo 演示</span><button class="next" @click="next">{{ step===3?'确认提交':'下一步' }}</button></footer>
    </div>
  </section>
</template>

<style scoped>
.wizard{max-width:980px;margin:0 auto;background:transparent!important;padding:0!important}.wizard-steps{display:grid;grid-template-columns:repeat(4,1fr);background:#fff;border:1px solid #e1e6ec;padding:20px;margin-bottom:16px}.wizard-steps>div{display:flex;gap:10px;align-items:flex-start;border-top:3px solid #dce2e9;padding-top:12px;color:#8a95a2}.wizard-steps>div.active,.wizard-steps>div.done{border-color:#d9272e;color:#263142}.wizard-steps i{font-style:normal;border:1px solid #cfd7e0;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px}.wizard-steps .done i{background:#168467;border-color:#168467;color:#fff}.wizard-steps span,.wizard-steps b,.wizard-steps small{display:block}.wizard-steps b{font-size:12px}.wizard-steps small{font-size:9px;color:#8b95a1;margin-top:4px;line-height:1.4}.wizard-card{background:#fff;border:1px solid #e1e6ec;padding:30px}.wizard-title{border-bottom:1px solid #e5e9ee;margin-bottom:24px}.wizard-title>span{font-size:10px;color:#d9272e;font-weight:800}.wizard-title h2{font-size:24px;margin:6px 0}.wizard-title p{color:#788492;font-size:12px}.wizard-fields{display:grid;grid-template-columns:1fr 1fr;gap:18px}.wizard-fields label>span{display:block;font-size:11px;color:#5f6c7b;margin-bottom:6px}.wizard-fields input,.wizard-fields select,.wizard-fields textarea{width:100%;box-sizing:border-box;border:1px solid #d7dfe8;padding:11px;background:#fff}.wizard-fields textarea{height:100px}.wizard-fields label.wide{grid-column:1/-1}.wizard-fields label>small{display:block;color:#8b95a2;margin-top:6px}.wizard-fields .upload{border:1px dashed #aeb9c6;padding:18px}.review-context{display:grid;grid-template-columns:120px 1fr;background:#f2f5f9;padding:16px;gap:8px}.review-context span{color:#7e8997}.review-panel dl{display:grid;grid-template-columns:1fr 1fr;gap:0 24px}.review-panel dl div{display:flex;border-bottom:1px solid #e7ebf0;padding:12px 0}.review-panel dt{color:#7c8795;width:120px}.review-panel dd{margin:0;font-weight:600}.rule-check{background:#edf8f4;border-left:4px solid #168467;padding:16px;margin-top:18px}.rule-check b{color:#168467}.rule-check p{font-size:11px;color:#667584}.wizard-card>footer{display:flex;align-items:center;border-top:1px solid #e5e9ee;margin-top:28px;padding-top:18px}.wizard-card>footer span{margin:auto;color:#99a2ae;font-size:10px}.wizard-card>footer button,.wizard-result button{padding:10px 20px}.back{background:#fff;border:1px solid #d7dfe8}.next,.wizard-result button{background:#d9272e;color:#fff;border:0}.wizard-result{text-align:center;padding:15px 30px}.wizard-result>i{display:grid;place-items:center;width:64px;height:64px;background:#168467;color:#fff;border-radius:50%;font-style:normal;font-size:30px;margin:auto}.wizard-result .reference{font-size:24px;font-weight:800;color:#315eae}.wizard-result>div{display:grid;grid-template-columns:130px 1fr;max-width:600px;margin:24px auto;text-align:left;background:#f4f6f9;padding:20px;gap:12px}.wizard-result>div span{color:#7e8996}.wizard-result>section{border-top:1px solid #e4e8ed;padding-top:18px}.wizard-result button{margin:5px}.wizard-result button+button{background:#fff;color:#344054;border:1px solid #d7dfe8}@media(max-width:760px){.wizard-steps{grid-template-columns:1fr 1fr;gap:12px}.wizard-fields,.review-panel dl{grid-template-columns:1fr}.wizard-fields label.wide{grid-column:auto}.wizard-card{padding:20px}.wizard-card>footer span{display:none}}
</style>
