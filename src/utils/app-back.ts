// 自定义back事件
// 数组里是函数
const back = [] as Function[]
export const setBack = (func: Function) => {
  back.push(func)
}

document.addEventListener('plusready', function () {
  let webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function () {
    if (back.length) {
      back.pop()?.()
    } else {
      webview.back()
    }
  })
})
// plus声明
declare const plus: any
