// 自定义back事件

// 数组里是函数
const back = [] as Function[]
export const setBack = (func: Function) => {
  back.push(func)
}
let count = 0
document.addEventListener('plusready', function () {
  let webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function () {
    if (back.length) {
      back.pop()?.()
    } else {
      webview.canBack((e: any) => {
        if (e.canBack) {
          webview.back()
        } else {
          // 两次退出
          if (count === 0) {
            count++
            plus.nativeUI.toast('再按一次退出应用')
            setTimeout(() => {
              count = 0
            }, 1500)
          } else {
            plus.runtime.quit()
          }
        }
      })
    }
  })
})

const colorRgbToHex = (rgbStr: string) => {
  //十六进制颜色值的正则表达式
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8}|[0-9a-fA-f]{6}[0-9]{2})$/
  if (reg.test(rgbStr)) {
    return rgbStr
  } else {
    const rgbArray = rgbStr.replace(/(?:\(|\)|rgba|rgb|RGBA|RGB)*/g, '').split(',')
    let strHex = '#'
    for (let i = 0; i < rgbArray.length; i++) {
      if (i !== 3) {
        if (rgbArray[i] == '0') {
          strHex += '00'
        } else {
          let newItem = Number(rgbArray[i]).toString(16)
          if (newItem.length < 2) {
            newItem = '0' + newItem
          }
          strHex += newItem
        }
      } else {
        strHex += rgbArray[i] == '0' ? '' : Number(rgbArray[i]) * 100
      }
    }
    return strHex
  }
}
export const setStatusBarColor = (color: string) => {
  if (!window.plus) return
  if (color.indexOf('rgb') === -1) {
    plus.navigator.setStatusBarBackground(color) // 设置状态栏颜色
  } else {
    // rgb转16进制
    plus.navigator.setStatusBarBackground(colorRgbToHex(color)) // 设置状态栏颜色
  }
}

// plus声明
declare const plus: any
declare global {
  interface Window {
    plus: any
  }
}
