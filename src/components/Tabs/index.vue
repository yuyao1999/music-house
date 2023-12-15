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
        <div>
          {{ item }}
        </div>
        <div v-if="leftComputed !== 0" :class="{ 'active-bottom': index === currentIndex }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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
  const tabsItem = document.querySelectorAll('.tabs-item')
  tabsItem.forEach((item: any) => {
    itemWidth.value.push(item.clientWidth)
    itemLeftDistance.value.push(item.offsetLeft)
  })
})
// active-bottom 宽度
const activeBottomWidth = ref(20)
// 屏幕宽度
const screenWidth = document.body.clientWidth
const unitDistance = computed(() => {
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
    activeBottomWidth.value = 10 * props.tabsList[value].length
  }
)
</script>

<style scoped lang="scss">
.tabs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  z-index: 20;
  display: flex;
  justify-content: space-around;
  padding: 0 5rem;
  align-items: center;
  height: 3rem;
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
}
</style>
