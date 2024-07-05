<template>
  <div>
    <span>Use the <code>slot</code> element to render children</span>
    <div>out:{{ text }}</div>
    <yy-element ref="yyEl" v-model="text" :estimatedItemSize="72" @virtualListChange="virtualListChange">
      <div v-for="item in virtualList" :key="item._index" :id="item._index">
        <strong class="break-words">{{ item.name }}</strong>
        is
        <div class="te">{{ item.age }}</div>
        <input type="text" v-model="text" />
      </div>

      <!-- <yy-template>
        <component is="style">
          :root{ --containerHeight:50vh; } .card{ padding:1rem;box-size;color:#fff} .te { color: red; }
          .inner{background:#3C3C3C} strong{word-wrap:break-word;}
        </component>
        <div class="card">
          <div class="inner">
            <strong>${this.name}</strong>
            is
            <div class="te">${this.age}</div>
            <button onclick="onCancel(${this.age})">取消${this.age}</button>
            <button onclick="onCard(${JSON.stringify(this).replace(/%22/g, %22'%22)})">确认${this.age}</button>
          </div>
        </div>
      </yy-template> -->
    </yy-element>
  </div>
</template>

<script setup lang="ts">
import '@/components/Lit/index'
import { ref, onMounted } from 'vue'
const yyEl = ref()
const text = ref('123')

const virtualList = ref([] as any)
const virtualListChange = (val: any) => {
  // console.log('virtualListChange', val)
  virtualList.value = val.detail
}

onMounted(() => {
  console.log('yyEl', yyEl.value)
})
const onCancel = (val: any) => {
  console.log('onCard', val)
}
const onCard = (val: any) => {
  console.log('onCard', val)
}

;(window as any).onCard = onCard
;(window as any).onCancel = onCancel
</script>

<style scoped lang="scss"></style>
