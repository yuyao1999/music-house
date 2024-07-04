<template>
  <div>
    <span>Use the <code>slot</code> element to render children</span>
    <div>out:{{ text }}</div>
    <yy-element ref="yyEl" v-model="text" :estimatedItemSize="80">
      <div slot="name" @click="onCard">in <input type="text" v-model="text" /></div>

      <yy-template>
        <component is="style">
          :root{ --containerHeight:50vh; } .card{ padding:1rem;box-size;color:#fff} .te { color: red; }
          .inner{background:#3C3C3C} strong{word-wrap:break-word;}
        </component>
        <div class="card">
          <div class="inner">
            <strong>${this.name}</strong>
            is
            <div class="te" @click="onCard">${this.age}</div>
            <button id="db">取消${this.age}</button>
          </div>
        </div>
      </yy-template>
    </yy-element>
  </div>
</template>

<script setup lang="ts">
import '@/components/Lit/index'
import { ref, onMounted } from 'vue'
const yyEl = ref()
const text = ref('123')

onMounted(() => {
  console.log('yyEl', yyEl.value)
})

const onCard = () => {
  console.log('onCard')
}
</script>

<style scoped lang="scss"></style>
