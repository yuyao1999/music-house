<template>
  <div>
    <button class="like-button" @click="onLike">
      <div class="like-wrapper">
        <div class="ripple"></div>
        <svg class="heart" width="24" height="24" viewBox="0 0 24 24">
          <path
            :class="like ? 'active' : ''"
            d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
          ></path>
        </svg>
        <div class="particles" :class="like ? 'active' : ''" style="--total-particles: 6">
          <div class="particle" style="--i: 1; --color: #7642f0"></div>
          <div class="particle" style="--i: 2; --color: #afd27f"></div>
          <div class="particle" style="--i: 3; --color: #de8f4f"></div>
          <div class="particle" style="--i: 4; --color: #d0516b"></div>
          <div class="particle" style="--i: 5; --color: #5686f2"></div>
          <div class="particle" style="--i: 6; --color: #d53ef3"></div>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface IProps {
  is_like?: number
  comment_id?: number
  parentId?: number
}
const props = defineProps<IProps>()
const like = ref(props.is_like || false)

const emits = defineEmits(['onLike', 'deleteLike'])
const onLike = () => {
  like.value = !like.value
  if (like.value) {
    emits('onLike', props.comment_id, props.parentId)
  } else {
    emits('deleteLike', props.comment_id, props.parentId)
  }
}
</script>

<style scoped lang="scss">
$colorBg: #fdf1f2;
$color: #f44336;
$colorHeart: #ea442b;
$easing: cubic-bezier(0.7, 0, 0.3, 1);
$duration: 0.5s;
.like-button {
  position: relative;
  font-size: 4em;
  appearance: none;
  border: none;
  border-radius: 50%;
  z-index: 2;
  transition: transform $duration $easing;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.1em;
  padding-bottom: 0;
}

.heart {
  width: 0.5em;
  height: 0.5em;
  display: block;

  > path {
    stroke: #fff;
    stroke-width: 2;
    fill: transparent;
    transition: fill $duration $easing;
  }
  .active {
    stroke: $colorHeart;
    fill: $colorHeart;
    transition: fill $duration $easing;
  }

  transform-origin: center 80%;
}

.particles {
  width: 1px;
  height: 1px;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 0.1em;
  width: 0.1em;
  border-radius: 0.05em;
  background-color: var(--color);
  --percentage: calc(var(--i) / var(--total-particles));
  --Θ: calc(var(--percentage) * 1turn);
  transform: translate(-50%, -50%) rotate(var(--Θ)) translateY(0) scaleY(0);
  transition: all $duration $easing;

  .active & {
    animation: particles-out calc($duration * 1.2) $easing forwards;
  }
  @keyframes particles-out {
    40% {
      height: 0.2em;
    }
    50%,
    60% {
      height: 0.2em;
      transform: translate(-50%, -50%) rotate(var(--Θ)) translateY(0.4em) scale(1);
    }
    100% {
      height: 0.3em;
      transform: translate(-50%, -50%) rotate(var(--Θ)) translateY(0.6em) scale(0);
    }
  }
}
</style>
