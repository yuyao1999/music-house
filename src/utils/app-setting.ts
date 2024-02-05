// 自定义back事件
// 数组里是函数
const back = [] as Function[]
export const setBack = (func: Function) => {
  back.push(func)
}
let count = 0
document.addEventListener('plusready', function () {
  getLocalVersion()
  setStatusBarHeight()
  setNavigationBar()
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

// 设置沉浸式状态栏 高度
export const setStatusBarHeight = () => {
  if (!window.plus) return
  const statusBarHeight = plus.navigator.getStatusbarHeight()
  const style = document.createElement('style')
  style.innerHTML = `
  .statusBarHeightPaddingTop {padding-top: ${statusBarHeight}px}
  :root{
    --statusBarHeight: ${statusBarHeight}px;
  }
  `
  console.log('statusBarHeight', statusBarHeight)
  document.getElementsByTagName('head')[0].appendChild(style)
}
// 设置（底部导航栏）
export const setNavigationBar = () => {
  if (!window.plus) return
  const Color = plus.android.importClass('android.graphics.Color')
  plus.android.importClass('android.view.Window')
  const mainActivity = plus.android.runtimeMainActivity()
  const window_android = mainActivity.getWindow()
  // 设置导航栏背景色纯黑
  window_android.setNavigationBarColor(Color.parseColor('#000000'))
}
// 获取本地应用资源版本号
const checkUrl = import.meta.env.VITE_API_MUSIC_BASE_URL + '/app/check_update'

export const getLocalVersion = () => {
  plus.runtime.getProperty(plus.runtime.appid, function (inf: any) {
    const wgtVer = inf.version
    console.log('当前应用版本：' + wgtVer)
    // post请求 传递版本号
    const data = JSON.stringify({
      version: wgtVer,
    })
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = true
    xhr.addEventListener('readystatechange', function () {
      console.log('this.readyState', this.readyState)
      console.log('this.status', this.status)
      if (this.readyState === 4) {
        console.log(this.responseText)
        const res = JSON.parse(this.responseText)
        if (res?.ok) {
          plus.nativeUI.confirm(
            '检测到新版本，是否更新？',
            function (e: any) {
              if (e.index === 0) {
                downWgt(res.data)
              }
            },
            '更新提示',
            ['确定']
          )
        }
      }
    })
    xhr.open('POST', checkUrl)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(data)
  })
}
// 下载wgt文件
function downWgt(wgtUrl: string) {
  console.log('wgtUrl', wgtUrl)
  let dtask = plus.downloader.createDownload(wgtUrl, { filename: '_doc/update/' }, function (d: any, status: any) {
    if (status == 200) {
      console.log('下载wgt成功：' + d.filename)
      installWgt(d.filename) // 安装wgt包
    } else {
      console.log('下载wgt失败！')
      plus.nativeUI.alert('下载wgt失败！')
    }
    plus.nativeUI.closeWaiting()
  })
  dtask.start()
}
// 更新应用资源
function installWgt(path: string) {
  plus.nativeUI.showWaiting('安装wgt文件...')
  plus.runtime.install(
    path,
    {},
    function () {
      plus.nativeUI.closeWaiting()
      console.log('安装wgt文件成功！')
      plus.nativeUI.alert('应用资源更新完成！', function () {
        plus.runtime.restart()
      })
    },
    function (e: any) {
      plus.nativeUI.closeWaiting()
      console.log('安装wgt文件失败[' + e.code + ']：' + e.message)
      plus.nativeUI.alert('安装wgt文件失败[' + e.code + ']：' + e.message)
    }
  )
}

// plus声明
declare const plus: any
declare global {
  interface Window {
    plus: any
  }
}
