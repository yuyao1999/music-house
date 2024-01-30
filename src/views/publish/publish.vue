<template>
  <div class="relative overflow-hidden">
    <PageTop title="发布动态">
      <template #right>
        <div class="right">发布</div>
      </template>
    </PageTop>
    <div class="chose">
      <div>
        <svg
          t="1706603657451"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6282"
          width="32"
          height="32"
        >
          <path
            d="M265.906 670.203c0 0 0 0 0 0 0 87.374 70.829 158.203 158.203 158.203 87.374 0 158.203-70.829 158.203-158.203 0 0 0 0 0 0 0-87.374-70.829-158.203-158.203-158.203-87.374 0-158.203 70.829-158.203 158.203z"
            fill="#1afa29"
            p-id="6283"
          ></path>
          <path d="M512 195.594v474.609h70.313v-333.984l193.359 52.734v-123.047z" fill="#1afa29" p-id="6284"></path>
        </svg>
      </div>
      添加音乐
    </div>
    <div class="input">
      <textarea v-focus class="textarea" placeholder="分享一下叭~" rows="11" maxlength="150" @input="onInput" />
      <div class="tips">{{ text?.length }}/150</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageTop from '@/components/PageTop/PageTop.vue'
import { ref } from 'vue'

const text = ref('')
const onInput = (e: any) => {
  text.value = e.target.value
}
</script>

<style scoped lang="scss">
.right {
  color: #fff;
  background: rgb(51, 194, 70);
  border-radius: 0.5rem;
  padding: 0.2rem 0.5rem;
}
.chose {
  margin: 0 2vw;
  margin-top: 10vh;
  height: 6vh;
  background: #313131;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input {
  width: 100%;
  padding: 0.5rem;
  padding-top: 1.5rem;
  color: #fff;
  .textarea {
    border: 0;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 1.5rem;
    resize: none;
    border: 1px solid #505050;
  }
  .tips {
    text-align: right;
    padding-right: 1rem;
  }
}
</style>
<style>
html {
  background: #000000;
}
</style>
