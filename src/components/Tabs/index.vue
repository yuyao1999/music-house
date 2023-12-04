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
        <div :class="{ 'active-bottom': index === currentIndex }" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
const leftComputed = computed(() => {
  // 2对应1倍 3对应0.5倍 4对应0.25倍
  const error = 1 / (props.tabsList.length - 1)
  if (props.left === 0) {
    return 50
  } else if (props.left < 0) {
    return 50 + -(props.left * error)
  } else {
    return 50 - props.left * error
  }
})
</script>

<style scoped lang="scss">
.tabs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  z-index: 999;
  display: flex;
  justify-content: space-around;
  padding: 0 5rem;
  align-items: center;
  height: 3rem;
  .tabs-item {
    font-size: 1rem;
    color: #ffffffab;
    position: relative;
    &.active {
      color: #fff;
      font-weight: bold;
      transition: all 0.3s linear;
    }
    .active-bottom {
      position: absolute;
      bottom: -0.5rem;
      width: 70%;
      // props.left是父组件传递过来的 0 对应50% 1对应100%
      left: v-bind("leftComputed+ '%'");
      transform: translateX(-50%);
      height: 0.16rem;
      background-color: #fff;
      transition: all 0.3s;
    }
  }
}
</style>
