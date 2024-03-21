<template>
  <div class="virtual-waterfall-container" ref="containerRef" @scroll="handleScroll">
    <div class="virtual-waterfall-list" :style="listStyle">
      <div id="real-list">
        <div class="virtual-waterfall-item" v-for="{ item, style } in renderList" :key="item.id" :style="style">
          <slot name="item" :item="item" :style="style"></slot>
        </div>
      </div>
      <div id="temporary-list" v-if="!isShow">
        <div v-for="{ item, style } in temporaryList" :key="item.id" :style="style">
          <slot name="item" :item="item" :style="style"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import type { IVirtualWaterFallProps, ICardItem, IBookColumnQueue, IBookRenderItem, IBookItemRect } from './type'
import { debounce, rafThrottle } from './tool'

const props = defineProps<IVirtualWaterFallProps>()

defineSlots<{
  item(props: { item: ICardItem; style: CSSProperties }): any
}>()

const containerRef = ref<HTMLDivElement | null>(null)

const resizeObserver = new ResizeObserver(() => {
  handleResize()
})

const dataState = reactive({
  loading: false,
  isFinish: false,
  currentPage: 1,
  list: [] as ICardItem[],
})

const scrollState = reactive({
  viewWidth: 0,
  viewHeight: 0,
  start: 0,
})

const queueState = reactive({
  queue: new Array(props.column).fill(0).map<IBookColumnQueue>(() => ({ list: [], height: 0 })),
  len: 0,
})

const hasMoreData = computed(() => queueState.len < dataState.list.length)

const temporaryList = ref<IBookRenderItem[]>([])

const isShow = ref(false)

const itemSizeInfo = ref(new Map<ICardItem['id'], IBookItemRect>())

const end = computed(() => scrollState.viewHeight + scrollState.start)

const cardList = computed(() => queueState.queue.reduce<IBookRenderItem[]>((pre, { list }) => pre.concat(list), []))

const renderList = computed(() => cardList.value.filter((i) => i.h + i.y > scrollState.start && i.y < end.value))

const computedHeight = computed(() => {
  let minIndex = 0,
    minHeight = Infinity,
    maxHeight = -Infinity
  queueState.queue.forEach(({ height }, index) => {
    if (height < minHeight) {
      minHeight = height
      minIndex = index
    }
    if (height > maxHeight) {
      maxHeight = height
    }
  })
  return {
    minIndex,
    minHeight,
    maxHeight,
  }
})

const listStyle = computed(() => ({ height: `${computedHeight.value.maxHeight}px` } as CSSProperties))

watch(
  () => props.column,
  () => {
    handleResize()
  }
)

const setItemSize = () => {
  itemSizeInfo.value = dataState.list.reduce<Map<ICardItem['id'], IBookItemRect>>((pre, current) => {
    const itemWidth = Math.floor((scrollState.viewWidth - (props.column - 1) * props.gap) / props.column)
    const rect = itemSizeInfo.value.get(current.id)
    pre.set(current.id, {
      width: itemWidth,
      height: rect ? rect.height : 0,
    })
    return pre
  }, new Map())
}

const updateItemSize = () => {
  temporaryList.value.forEach(({ item, h }) => {
    const rect = itemSizeInfo.value.get(item.id)!
    itemSizeInfo.value.set(item.id, { ...rect, height: h })
  })
}
const addInQueue = (size = props.enterSize) => {
  for (let i = 0; i < size!; i++) {
    const minIndex = computedHeight.value.minIndex
    const currentColumn = queueState.queue[minIndex]
    const before = currentColumn.list[currentColumn.list.length - 1] || null
    const dataItem = dataState.list[queueState.len]
    const item = generatorItem(dataItem, before, minIndex)
    currentColumn.list.push(item)
    currentColumn.height += item.h
    queueState.len++
  }
}

const generatorItem = (item: ICardItem, before: IBookRenderItem | null, index: number): IBookRenderItem => {
  const rect = itemSizeInfo.value.get(item.id)!
  const width = rect.width
  const height = rect.height
  let y = 0
  if (before) y = before.y + before.h + props.gap
  return {
    item,
    y,
    h: height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate3d(${index === 0 ? 0 : (width + props.gap) * index}px, ${y}px, 0)`,
    },
  }
}

const loadDataList = async () => {
  if (dataState.isFinish) return
  dataState.loading = true
  const source = await props.request(dataState.currentPage++, props.pageSize)
  const list = source.data
  if (!list.length) {
    dataState.isFinish = true
    return
  }
  dataState.list.push(...list)
  dataState.loading = false
  return list.length
}

const handleScroll = rafThrottle(() => {
  const { scrollTop, clientHeight } = containerRef.value!
  scrollState.start = scrollTop
  //分页加载更多
  if (props.isPagination && !dataState.loading && !hasMoreData.value) {
    loadDataList().then((len) => {
      len && setItemSize()
      len && mountTemporaryList()
    })
    return
  }
  if (scrollTop + clientHeight > computedHeight.value.minHeight) {
    mountTemporaryList()
  }
})

const handleResize = debounce(() => {
  initScrollState()
  reComputedQueue()
}, 300)

const reComputedQueue = () => {
  setItemSize()
  queueState.queue = new Array(props.column).fill(0).map<IBookColumnQueue>(() => ({ list: [], height: 0 }))
  queueState.len = 0
  containerRef.value!.scrollTop = 0
  mountTemporaryList(props.pageSize)
}

const mountTemporaryList = (size = props.enterSize) => {
  if (!hasMoreData.value) return

  isShow.value = false

  console.log('temporaryList 1')
  for (let i = 0; i < size!; i++) {
    const item = dataState.list[queueState.len + i]
    if (!item) break
    const rect = itemSizeInfo.value.get(item.id)!
    temporaryList.value.push({
      item,
      y: 0,
      h: 0,
      style: {
        width: `${rect.width}px`,
      },
    })
  }

  nextTick(() => {
    const list = document.querySelector('#temporary-list')!
    ;[...list.children].forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      temporaryList.value[index].h = rect.height
    })

    isShow.value = true
    updateItemSize()
    addInQueue(temporaryList.value.length)
    temporaryList.value = []
    console.log('temporaryList 2')
  })
}

const initScrollState = () => {
  scrollState.viewWidth = containerRef.value!.clientWidth
  scrollState.viewHeight = containerRef.value!.clientHeight
  scrollState.start = containerRef.value!.scrollTop
}

const init = async () => {
  initScrollState()
  // resizeObserver.observe(containerRef.value!)
  const len = await loadDataList()
  setItemSize()
  len && mountTemporaryList(len)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  containerRef.value && resizeObserver.unobserve(containerRef.value)
})
</script>

<style scoped lang="scss">
#temporary-list {
  position: absolute;
  top: 9999px;
}
.virtual-waterfall {
  &-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  &-list {
    position: relative;
    width: 100%;
  }
  &-item {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
