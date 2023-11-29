<!-- @format -->

<template>
  <div ref="mine" class="statusBarHeightPaddingTop">
    11111111111
    <br />
    <input type="text" v-model="text" />
    <div @click="music">music</div>
    很多大厂 App
    列表在滑动过程中，再次左滑或者右滑还是能切换页面，这点体验还是比较好的，因为不用等到页面停止再左滑右滑切换页面，体验很丝滑，比如QQ联系人那个ViewPager嵌套列表就支持。
    写文章之前先聊一下其他的愉悦身心吧。最近总是在安卓群里或者B站里听到行情不好，找工作难，互联网没救了，寒冬来了，要饿死了这样的消极言论。其实大环境这样我们作为代码人也很难去改变，该学习还是得学习该吃饭睡觉还是得吃饭睡觉，该玩还是得玩。就如太阳东升西落、四时更替、风雨雷电我们都无法去改变，只能去适应，太阳升起就劳作太阳落下就休息，天要下雨就撑把伞，季节更替就添补衣裳，人法地，地法天，天法道，道法自然，人在自然面前何其渺小，只能去适应和顺乎自然，就业大环境也是如此没有什么不能去适应的，物竞天择适者生存，只要有了适应能力，就算互联网行业不复存在，我们凭借着适应能力，也能在其他领域很好的生存下来。上天有好生之德，大自然有这么多东西，想要饿死一个人还真是有点难，所以也不要过多的杞人忧天，该咋样还是得咋样，就业大环境自然会在该好的时候好起来，我们只要写好自己的代码，好好学习，通过代码拿到属于我们自己应有的就好了，不属于自己的一毫而莫取。
    好了，就此打住，干正事了。我们想要列表在滑动过程中，再次左滑或者右滑能够切换界面，那肯定是要对事件分发机制有充分的理解。
    产品经理： 做个这种效果不是很简单吗，先这样后那样在这样不就行了？ Talk is cheap , Show me your code 。
    再谈事件分发机制 什么是事件分发机制，用一句话来说，就是这个机制可以让 view 和 viewGroup
    之间能够合理的处理的所到来的事件，你要处理我就让你处理，而不是事件来了你处理一下我处理一下毫无章法可言，整个view
    体系都乱套了，反应到用户界面体验就是界面在胡乱的滑动。 <br />22222 <br />
    为了能实现滑动过程中，再次左滑或者右滑能够切换界面（像QQ联系人列表那样），我们只看ViewGroup 的dispatchTouchEvent
    方法就行了，无须涉及从手指触摸屏幕到一个具体view上这一整套流程，只要dispatchTouchEvent方法真正搞懂理解了，自然就能处理这个需求了。
    先看dispatchTouchEvent 中关于onInterceptTouchEvent处理部分。 通过以上面代码我们可以了解到，onInterceptTouchEvent
    只有在Down 事件或者mFirstTouchTarget不为null，并且在自身没有设置FLAG_DISALLOW_INTERCEPT这个标记才会调用。
    为什么要这样搞个这种章法，有什么实际作用我们要怎么去理解？其实也很好理解，Down
    事件就是先找到这一次事件流有哪些子View能处理，然后把它们用链表mFirstTouchTarget储存起来，链表插入方式是头插法，即下次事件都优先给最近处理此次事件的view来处理。
    这里提出一个问题，如果FrameLayout 里有 View1 和 View2 ，View2在View1上层叠显示，两个View的onTouchEvent 处理 Down
    事件都返回true其他返回默认 ，此时在View2上滑动mFirstTouchTarget 这个链表的结构是怎么样的？
    好了，跳出问题接着继续分析这个代码设计 ， 通过代码我们可以看到，处理事件冲突优先是选择内部拦截法，即通过改变
    FLAG_DISALLOW_INTERCEPT标志位来处理，子view
    <div @click="toLogin">login</div>
    和自己都可以改变这个标记位，当没有FLAG_DISALLOW_INTERCEPT这个标记位的时候，会调用自己的onInterceptTouchEvent方法，通过onInterceptTouchEvent
    自己也可以决定给不给子view处理的机会。
    这个机制说白点就是大家都平等，就看你要不要处理，如果你要处理我就给你处理（你给我设置了FLAG_DISALLOW_INTERCEPT），你处理了我就不处理了。如果你不处理，这时候我就自己替你决定要不要给你处理的机会（onInterceptTouchEvent
    ）。 好了，理论讲完回归需求，ViewPager2（ 左右滑动）中嵌套垂直滑 作者：jiangpan
    链接：https://juejin.cn/post/7283151857148821559 来源：稀土掘金
    著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
    <br />
    333333333
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useShow } from '@/hooks/useShow'
import { useRouter } from 'vue-router'
import { useMusicStore } from '@/store/modules/music'
import { useAudio } from '@/hooks/useAudio'

const { getMusicSearch } = useAudio()
onMounted(() => {
  console.log('onMounted 我的')
  useShow({
    el: mine.value,
    onShow,
    onHide,
  })
})
onUnmounted(() => {
  // console.log('onUnmounted 我的')
})
const onShow = () => {
  console.log('onShow mine')
}
const onHide = () => {
  console.log('onHide mine')
}
const mine = ref<HTMLDivElement>()

const router = useRouter()
const toLogin = () => {
  router.push({ name: 'login' })
}
const text = ref('1')
const musicStore = useMusicStore()
const music = () => {
  getMusicSearch(text.value)
  musicStore.setShow(true)
}
</script>

<style scoped lang="scss"></style>
