<template>
  <div ref="listRef" :style="{ height }" class="infinite-list-container" @scroll="scrollEvent">
    <div ref="phantomRef" class="infinite-list-phantom"></div>
    <div ref="contentRef" class="infinite-list">
      <div ref="itemsRef" :id="item._index" :key="item._index" v-for="(item, index) in visibleData">
        <slot name="item" :data="item" v-if="defer(index)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUpdated, ref, watch } from 'vue'
import { useDefer } from '@/hooks/useDefer'

const { defer, reset } = useDefer()

const props = defineProps({
  //所有列表数据
  listData: {
    type: Array,
    required: true,
  },
  //预估高度
  estimatedItemSize: {
    type: Number,
    required: true,
  },
  // 容器高度
  height: {
    type: String,
    default: '100%',
  },
})

const listRef = ref()
const phantomRef = ref()
const contentRef = ref()
const itemsRef = ref()

const positions = [] as any
const getPositions = () => {
  positions.push(
    ...props.listData.slice(positions.length, props.listData.length).map((_, index: number) => {
      const indexRes = positions.length + index
      return {
        index: positions.length + index,
        height: props.estimatedItemSize,
        top: indexRes * props.estimatedItemSize,
        bottom: (indexRes + 1) * props.estimatedItemSize,
      }
    })
  )
}
watch(
  () => props.listData.length,
  () => {
    reset()
    getPositions()
  },
  {
    immediate: true,
  }
)

defineExpose({
  listRef,
})

const _listData = computed(() =>
  props.listData.map((item: any, index) => {
    return {
      _index: `_${index}`,
      item,
    }
  })
)

const visibleCount = computed(() => {
  return Math.ceil(screenHeight.value / props.estimatedItemSize)
})
const visibleData = computed(() => {
  return _listData.value.slice(start.value, end.value)
})

// 可视区域高度
const screenHeight = ref(0)
// 起始索引
const start = ref(0)
// 结束索引
const end = ref(0)
onMounted(() => {
  screenHeight.value = listRef.value?.clientHeight || 0
  start.value = 0
  end.value = visibleCount.value
})
onUpdated(() => {
  nextTick(() => {
    if (!itemsRef.value || !itemsRef.value.length) return
    //获取真实元素大小，修改对应的尺寸缓存
    updateItemsSize()
    //更新列表总高度
    const height = positions[positions.length - 1].bottom
    phantomRef.value.style.height = height + 'px'
    //更新真实偏移量
    setStartOffset()
  })
})

//获取列表项的当前尺寸
const updateItemsSize = () => {
  const nodes = itemsRef.value || []
  console.log('nodes', nodes)
  nodes.forEach((node: HTMLElement) => {
    let rect = node.getBoundingClientRect()
    let height = rect.height
    let index = +node.id.slice(1)
    let oldHeight = positions[index].height
    let dValue = oldHeight - height
    //存在差值
    if (dValue) {
      positions[index].bottom = positions[index].bottom - dValue
      positions[index].height = height
      for (let k = index + 1; k < positions.length; k++) {
        positions[k].top = positions[k - 1].bottom
        positions[k].bottom = positions[k].bottom - dValue
      }
    }
  })
}
//获取当前的偏移量
const setStartOffset = () => {
  let startOffset = start.value >= 1 ? positions[start.value - 1].bottom : 0
  contentRef.value.style.transform = `translate3d(0,${startOffset}px,0)`
}
//获取列表起始索引
const getStartIndex = (scrollTop: number = 0) => {
  return binarySearch(positions, scrollTop)
}
const binarySearch = (list: any[], value: number) => {
  let start = 0
  let end = list.length - 1
  let tempIndex = null
  while (start <= end) {
    let midIndex = Math.floor((start + end) / 2)
    let midValue = list[midIndex].bottom
    if (midValue === value) {
      return midIndex + 1
    } else if (midValue < value) {
      start = midIndex + 1
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end = end - 1
    }
  }
  return tempIndex
}
const scrollEvent = () => {
  //当前滚动位置
  let scrollTop = listRef.value.scrollTop
  //此时的开始索引
  start.value = getStartIndex(scrollTop) || 0
  //此时的结束索引
  end.value = start.value + visibleCount.value
  //此时的偏移量
  setStartOffset()
}
</script>

<style scoped lang="scss">
.infinite-list-container {
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}
</style>
