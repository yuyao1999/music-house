<template>
  <div v-if="textValue.length > max" class="content-scroll-text">
    <div class="scroll1">{{ textValue }}</div>
    <div class="scroll2">
      {{ textValue }}
    </div>
  </div>
  <div v-else class="content-scroll-text">
    {{ textValue }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface IProps {
  text: string | undefined
  max?: number
}
const props = withDefaults(defineProps<IProps>(), {
  max: 9,
})
// 文字超出滚动 无缝衔接
const textValue = ref('')
const time = ref(10)
watch(
  () => props.text,
  (val) => {
    if (val) {
      textValue.value = val
      if (val.length > props.max) {
        textValue.value = val + '\xa0\xa0\xa0\xa0\xa0\xa0'
        time.value = val.length * 0.5
      }
    }
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
$time: v-bind("time+'s'");
// 无缝滚动
.content-scroll-text {
  width: 100%;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;

  .scroll1 {
    display: inline-block;
    animation: scroll $time linear infinite;
  }
  .scroll2 {
    display: inline-block;
    animation: scroll $time linear infinite;
  }
}

@keyframes scroll {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-100%, 0, 0);
  }
}
</style>
