<template>
  <div class="app">
    <PageTop title="获赞列表" />
    <div class="container" ref="fContainerRef">
      <VirtualAndWaterfallList
        :request="getData"
        :gap="25"
        :page-size="10"
        :column="column"
        :enter-size="column * 2"
        :is-pull-down-refresh="true"
        :is-pagination="true"
        filed="data"
      >
        <template #item="{ item }">
          <Card
            @click="onCard(item)"
            :detail="{
              user_id: item.user_id,
              id: item.id,
              username: item.username,
              photo: item.photo,
              son_name: item.son_name,
              create_time: item.create_time,
            }"
          />
        </template>
      </VirtualAndWaterfallList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Card from './card.vue'
import VirtualAndWaterfallList from '@/components/VirtualAndWaterfallList/index.vue'
import PageTop from '@/components/PageTop/index.vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { useRoute } from 'vue-router'
const userId = useRoute().query.userId
const userStore = useUserStore()
const fContainerRef = ref<HTMLDivElement | null>(null)
const column = ref(1)
const fContainerObserver = new ResizeObserver((entries) => {
  changeColumn()
})

const changeColumn = () => {
  column.value = 1
}

onMounted(() => {
  fContainerRef.value && fContainerObserver.observe(fContainerRef.value)
})

onUnmounted(() => {
  fContainerRef.value && fContainerObserver.unobserve(fContainerRef.value)
})

const getData = (page: number, size: number) => {
  return userApi.getLikePage({
    page,
    size,
    user_id: userId ?? userStore.id,
  }) as any
}
const onCard = (item: any) => {}
</script>

<style scoped lang="scss">
.app {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: #010101;
  .container {
    padding: 1rem;
    // padding-top: calc(4rem + var(--statusBarHeight));
    //statusBarHeight 有值则加上状态栏高度 无值则不加
    padding-top: calc(3rem + var(--statusBarHeight, 0px));
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
}
</style>
