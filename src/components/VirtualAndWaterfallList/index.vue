<template>
  <div ref="dragTipRef" v-if="dragType" class="text-light-500" :style="dragTipStyle()">{{ dragTip }}</div>
  <div class="virtual-waterfall-container" ref="containerRef" @scroll="handleScroll">
    <div class="virtual-waterfall-list" :style="listStyle">
      <div v-if="dataState.list.length" id="real-list">
        <div class="virtual-waterfall-item" v-for="{ item, style } in renderList" :key="item.id" :style="style">
          <slot name="item" :item="item" :style="style"></slot>
          <div v-if="item.id === dataState.list[dataState.list.length - 1].id && dataState.isFinish" class="no-more">
            ---没有更多了---
          </div>
          <div
            v-else-if="item.id === dataState.list[dataState.list.length - 1].id && dataState.loading"
            class="no-more"
          >
            ---加载中---
          </div>
        </div>
      </div>
      <div v-else>
        <!-- 没有数据 -->
        <slot name="empty">
          <div class="no-data">暂无数据~</div>
        </slot>
      </div>
      <div id="temporary-list" v-if="isShow">
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
import { musicApi } from '@/api/music'
import { useDraggable } from '@/hooks/useDraggable'

const props = withDefaults(defineProps<IVirtualWaterFallProps>(), {
  isPullDownRefresh: false,
  pullDownRefreshDistance: 100,
})

const containerRef = ref<HTMLDivElement | null>(null)
const dragTipRef = ref<HTMLDivElement | null>(null)

const resizeObserver = new ResizeObserver(() => {
  console.log('resizeObserver', resizeObserver)
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

const isShow = ref(true)

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

const listStyle = computed(
  () => ({ height: `${computedHeight.value.maxHeight + cardList.value.length * props.gap}px` } as CSSProperties)
)

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
  const list = source[props.filed]

  if (!list.length) {
    dataState.isFinish = true
    dataState.loading = false
    return
  }
  dataState.list.push(...list)
  if (props.filed === 'songs') {
    dataState.list.forEach(async (item: any) => {
      const res: any = await musicApi.detail({ ids: item.id })
      item.imgSrc = res.songs[0]?.al?.picUrl
    })
  }

  dataState.loading = false
  return list.length
}

const handleScroll = rafThrottle(() => {
  if (dragAnimationDoing.value) return
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
let fistLoad = true
const handleResize = debounce(() => {
  if (fistLoad && props.column === 1) {
    fistLoad = false
    return
  }
  console.log('reComputedQueue')
  initScrollState()
  reComputedQueue()
}, 300)

const reComputedQueue = () => {
  setItemSize()
  queueState.queue = new Array(props.column).fill(0).map<IBookColumnQueue>(() => ({ list: [], height: 0 }))
  queueState.len = 0
  containerRef.value?.scrollTop && (containerRef.value.scrollTop = 0)
  mountTemporaryList(props.pageSize)
}

const mountTemporaryList = (size = props.enterSize) => {
  if (!hasMoreData.value) return
  isShow.value = true
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
    const list = document.querySelector('#temporary-list')
    if (!list) return
    ;[...list.children].forEach((item, index) => {
      const rect = item.getBoundingClientRect()
      temporaryList.value[index].h = rect.height
    })

    isShow.value = false
    updateItemSize()
    addInQueue(temporaryList.value.length)
    temporaryList.value = []
  })
}

const initScrollState = () => {
  scrollState.viewWidth = containerRef.value?.clientWidth || 0
  scrollState.viewHeight = containerRef.value?.clientHeight || 0
  scrollState.start = containerRef.value?.scrollTop || 0
}

const dragType = ref<'start' | 'refresh' | 'doing' | 'finish' | ''>('')
const dragTip = computed(() => {
  switch (dragType.value) {
    case 'start':
      return '继续下拉刷新~'
    case 'refresh':
      return '松开立即刷新~'
    case 'doing':
      return '正在刷新~'
    case 'finish':
      return '刷新完成~'
  }
})
const dragTipStyle = () => {
  if (top.value > props.pullDownRefreshDistance || top.value < 20) {
    dragType.value = ''
    return
  }
  return `
      position: absolute;
      left:50%;
      transform:translate3d(-50%,${-props.pullDownRefreshDistance / 2.5 + top.value}px,0);
    `
}
const onDragStart = () => {
  if (scrollState.start !== 0) return
}
const syncDoing = async (time: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}
const dragAnimationDoing = ref(false)
const refreshData = async () => {
  // 重新加载
  dataState.currentPage = 1
  dataState.isFinish = false
  dataState.list = []
  queueState.queue = new Array(props.column).fill(0).map<IBookColumnQueue>(() => ({ list: [], height: 0 }))
  queueState.len = 0
  init()
}
const onDragEnd = async () => {
  if (scrollState.start !== 0) return
  if (dragType.value === 'refresh') {
    dragType.value = 'doing'
    await refreshData()
    dragType.value = 'finish'
  }
  if (dragType.value === 'finish') {
    await syncDoing(500)
    dragTipRef.value!.style.transform = `translate3d(-50%, 0, 0)`
    dragTipRef.value!.style.opacity = '0'
    dragTipRef.value!.style.transition = 'all 0.4s'
  }
  dragType.value = ''
  containerRef.value!.style.transform = `translate3d(0, 0, 0)`
  containerRef.value!.style.transition = 'transform 0.5s'
  dragAnimationDoing.value = true
  setTimeout(() => {
    containerRef.value!.style.transition = ''
    scrollState.start = 0
    top.value = 0
    dragAnimationDoing.value = false
  }, 500)
}
const { setDraggable, top } = useDraggable({
  axis: 'y',
  onDragStart,
  onDragEnd,
})
watch(
  () => top.value,
  rafThrottle(() => {
    if (
      props.isPullDownRefresh !== true ||
      dragAnimationDoing.value ||
      top.value < 0 ||
      (scrollState.start !== 0 && !dragType.value)
    )
      return
    if (top.value > props.pullDownRefreshDistance / 4) {
      dragType.value = 'start'
    }
    if (top.value >= props.pullDownRefreshDistance / 2) {
      dragType.value = 'refresh'
    }
    if (top.value > props.pullDownRefreshDistance) {
      top.value = props.pullDownRefreshDistance
    }
    scrollState.start = 0
    containerRef.value!.style.transform = `translate3d(0, ${top.value}px, 0)`
  })
)
const init = async () => {
  resizeObserver.observe(containerRef.value!)
  initScrollState()
  const len = await loadDataList()
  setItemSize()
  len && mountTemporaryList(len)
  setDraggable(containerRef.value!)
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
$distance: 100px;
@keyframes MoveAnimateDown {
  0% {
    opacity: 0;
    transform: translate3d(0, $distance, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.no-more {
  text-align: center;
  color: #fff;
  padding: 1rem;
  padding-top: 3rem;
  animation: MoveAnimateDown 0.5s ease-in-out;
}
.no-data {
  padding: 1rem;
  color: #fff;
  font-size: 2rem;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
