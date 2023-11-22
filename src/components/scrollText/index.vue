<template>
  <div>
    <span v-if="textValue.length > max" class="content">
      <span class="scroll1">
        {{ textValue }}
      </span>
      <span class="scroll2">
        {{ textValue }}
      </span>
    </span>
    <span v-else>
      {{ textValue }}
    </span>
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

watch(
  () => props.text,
  (val) => {
    if (val) {
      textValue.value = val
    }
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
$time: 10s;
// 无缝滚动
.content {
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  .scroll1,
  .scroll2 {
    display: inline-block;
    animation: scroll $time linear infinite;
  }
  .scroll1 {
    animation-delay: 0s;
  }
  .scroll2 {
    animation-delay: $time / 2;
  }
}

@keyframes scroll {
  0% {
    transform: translateX(10%);
  }
  100% {
    transform: translateX(-110%);
  }
}
</style>
