<template>
  <div>
    <span>Use the <code>slot</code> element to render children</span>
    <div>out:{{ text }}</div>
    <yy-element
      id="virtualListId"
      ref="yyEl"
      v-model="text"
      :estimatedItemSize="192"
      @virtualListChange="virtualListChange"
      :request="getData"
      style="--containerHeight: 50vh"
    >
      <div
        class="card"
        v-for="item in virtualList"
        :key="item._index"
        :id="item._index"
        :style="handleClass(item._index)"
      >
        <div class="inner">
          <div>{{ item._index }}</div>
          <div v-if="item._index === '_11'">达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦达瓦</div>
          <strong class="break-words">{{ item.id }}</strong>
          is
          <div class="te">{{ item.name }}</div>
          <div class="te">{{ item.name }}</div>
          <div class="te">{{ item.name }}</div>
        </div>
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
import { ref, onMounted, nextTick } from 'vue'
import { musicApi } from '@/api/music'

const yyEl = ref()
const text = ref('123')

const virtualList = ref([] as any)
const virtualListChange = (val: any) => {
  virtualList.value = val.detail
}

const handleClass = (id: string) => {
  nextTick(() => {
    const dom = document.getElementById(id)
    if (!dom) return
    // 在上方出现使用animate-move-up-class 动画 否则使用animate-move-down-class 动画
    const top = dom.getBoundingClientRect().top
    if (top < document.getElementById('virtualListId')?.clientHeight! / 2) {
      dom.classList.add('animate-move-up-class')
    } else {
      dom.classList.add('animate-move-down-class')
    }
  })
  return ''
}

const getData = async (page: number, pageSize: number) => {
  const res: any = await musicApi.singerSongs({
    id: 12199576,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    order: 'time',
  })
  // await awaitTime(1000 * 20)
  if (page === 3) return []
  return res.songs
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

<style scoped lang="scss">
@keyframes MoveAnimateDown {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes MoveAnimateUp {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-move-down-class {
  animation: MoveAnimateDown 0.5s ease-in-out;
}
.animate-move-up-class {
  animation: MoveAnimateUp 0.5s ease-in-out;
}
.card {
  padding: 1rem;
  .inner {
    padding: 1rem;
    background: #d8d1d1;
    border-radius: 20px;
  }
}
</style>
