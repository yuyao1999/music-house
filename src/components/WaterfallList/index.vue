<template>
  <div class="content" ref="contentRef">
    <div class="card" :style="{ '--h': Math.max(...tabulationHeights) + 'px' }">
      <div
        ref="listRef"
        class="card-list"
        v-for="(item, index) in list"
        :key="index"
        :style="{ backgroundColor: item.color, height: item.height, width: 'calc(100% / ' + columns + ')' }"
      >
        <slot name="item" :data="{ ...item, index }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { onMounted, ref, nextTick, PropType } from 'vue'

const props = defineProps({
  list: {
    type: Array as PropType<{ color: string; height: string }[]>,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  // 几列
  columns: {
    type: Number,
    default: 4,
  },
})

const contentRef = ref()
const listRef = ref()
defineExpose({
  listRef,
  contentRef,
})
onMounted(() => {
  console.log('listRef.value.childNodes', listRef.value)
  listRef.value.forEach((el: any) => {
    updateLayout(el)
  })
})

watch(
  () => props.list.length,
  () => {
    nextTick(() => {
      listRef.value.slice(-props.size).forEach((el: any) => {
        updateLayout(el)
      })
    })
  }
)

const tabulationHeights = ref(new Array(props.columns).fill(0))

const updateLayout = (el: any) => {
  const columns = getMinTabulationHeight(tabulationHeights.value)
  const top = tabulationHeights.value[columns]
  const left = columns * el.clientWidth
  el.style.transform = `translate(${left}px,${top}px)`
  tabulationHeights.value[columns] += el.offsetHeight
}

const getMinTabulationHeight = (arr: any) => {
  let min = Math.min(...arr)
  return arr.indexOf(min) !== -1 ? arr.indexOf(min) : 0
}
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
.card {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: var(--h);
}
.card-list {
  position: absolute;
  width: var(--v);
}
</style>
