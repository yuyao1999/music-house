<template>
  <div>
    <div class="tabs">
      <div
        v-for="(item, index) in tabsList"
        :key="index"
        class="tabs-item"
        :class="{ active: index === currentIndex }"
        @click="changeIndex(index)"
      >
        <div class="flex items-center gap-1">
          {{ item }}
          <div v-show="index === 0 && currentIndex === 0">
            <svg
              t="1706147573771"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9549"
              width="20"
              height="20"
            >
              <path
                d="M860.842667 669.696l-146.346667 150.869333a42.026667 42.026667 0 0 1-59.861333 0.469334 42.666667 42.666667 0 0 1 0-60.330667l63.488-63.530667a8.533333 8.533333 0 0 0-6.058667-14.549333H213.333333a42.666667 42.666667 0 0 1 0-85.333333l519.338667 0.042666h97.536a42.666667 42.666667 0 0 1 30.634667 72.362667zM369.365333 202.965333a42.666667 42.666667 0 0 1 0 60.330667L305.877333 326.784A8.533333 8.533333 0 0 0 311.936 341.333333H810.666667a42.666667 42.666667 0 0 1 0 85.333334H188.202667a42.666667 42.666667 0 0 1-30.165334-72.832l150.997334-150.869334a42.666667 42.666667 0 0 1 60.330666 0z"
                fill="#FFFFFF"
                p-id="9550"
              ></path>
            </svg>
          </div>
        </div>
        <div v-if="leftComputed !== 0" :class="{ 'active-bottom': index === currentIndex }" />
      </div>
      <div class="search" @click="toSearch">
        <svg
          t="1706603763744"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8243"
          width="20"
          height="20"
        >
          <path
            d="M496 96C275.09 96 96 275.08 96 496s179.09 400 400 400 400-179.08 400-400S716.91 96 496 96z m0-96c273.93 0 496 222.07 496 496 0 119.69-42.4 229.48-112.99 315.17l130.93 130.89c18.75 18.75 18.75 49.14 0 67.88-17.57 17.57-45.38 18.67-64.24 3.29l-3.65-3.29-130.88-130.93C725.48 949.6 615.69 992 496 992 222.07 992 0 769.93 0 496S222.07 0 496 0z"
            fill="#FFFFFF"
            p-id="8244"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const toSearch = () => {
  router.push('/search')
}

interface IProps {
  /**
   * 列表
   */
  tabsList: string[]
  /**
   * 当前所在的索引
   */
  currentIndex: number
  /**
   * 下标所在的位置
   */
  left: number
}
const props = defineProps<IProps>()

const emits = defineEmits<{ (e: 'changeIndex', value: number): void }>()
const changeIndex = (index: number) => {
  emits('changeIndex', index)
}
// 获取每个item的宽度
const itemWidth = ref<any>([])
// 每个item距离左边的距离
const itemLeftDistance = ref<any>([])
onMounted(() => {
  setTimeout(() => {
    getWidth()
  }, 1000)
})

const getWidth = () => {
  const tabsItem = document.querySelectorAll('.tabs-item')
  itemWidth.value = []
  itemLeftDistance.value = []
  tabsItem.forEach((item: any) => {
    itemWidth.value.push(item.clientWidth)
    itemLeftDistance.value.push(item.offsetLeft)
  })
}

// active-bottom 宽度
const activeBottomWidth = ref(20)
// 屏幕宽度
const unitDistance = computed(() => {
  const screenWidth = document.body.clientWidth
  let space = 0
  if (props.currentIndex === props.tabsList.length - 1) {
    space = itemLeftDistance.value[props.currentIndex] - itemLeftDistance.value[props.currentIndex - 1]
  } else {
    space = itemLeftDistance.value[props.currentIndex + 1] - itemLeftDistance.value[props.currentIndex]
  }
  return space / screenWidth
})
const leftComputed = computed(() => {
  const startLeft =
    itemLeftDistance.value[props.currentIndex] + itemWidth.value[props.currentIndex] / 2 - activeBottomWidth.value / 2
  // 动态变化根据props.left的值来变化
  if (props.left == 0) {
    return startLeft || 0
  }
  const space = Math.abs(props.left) * unitDistance.value
  if (props.left < 0) {
    // 向左滑动
    return startLeft + space
  } else {
    // 向右滑动
    return startLeft - space
  }
})
watch(
  () => props.currentIndex,
  (value: number) => {
    nextTick(() => {
      getWidth()
      activeBottomWidth.value = 10 * props.tabsList[value].length
    })
  }
)
</script>

<style scoped lang="scss">
.tabs {
  position: fixed;
  top: calc(0px + var(--statusBarHeight));
  left: 0;
  width: 100%;
  background-color: transparent;
  z-index: 20;
  display: flex;
  justify-content: space-around;
  padding: 0 5rem;
  align-items: center;
  height: 3rem;
  cursor: pointer;
  // 取消长按的背景色
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  -moz-user-focus: none;
  -moz-user-select: none;
  .tabs-item {
    font-size: 1rem;
    color: #ffffffab;
    &.active {
      color: #fff;
      font-weight: bold;
      transition: all 0.3s linear;
    }
    .active-bottom {
      position: absolute;
      bottom: 0;
      width: v-bind("activeBottomWidth + 'px'");
      left: v-bind("leftComputed+ 'px'");
      height: 0.16rem;
      background-color: #fff;
      transition: all 0.3s;
    }
  }
  .search {
    position: absolute;
    right: 0;
    top: 0;
    width: 3rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
