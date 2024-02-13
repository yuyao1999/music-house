/** @format */

export class AcGame {
  constructor(id, AcWingOS) {
    this.id = id
    this.AcWingOS = AcWingOS
    // this.AcWingOS.api.window.resize((390 + 2) * (100 / window.innerWidth), 844 * (100 / window.innerHeight) + 4)
    this.settings = new Settings(this)
  }
}
class Settings {
  constructor(root) {
    this.root = root
    this.message = new message()
    this.message.loadingMessage()
    // this.up_js(root)
    this.start(root)
    $('html')[0].style.overflow = 'hidden'
  }

  start(root) {
    this.getinfo_acapp(root)
  }
  up_js(root, token) {
    let id = root.id
    this.$ac_game = $('#' + id)
    this.$ac_game.append(`<div id="app"></div>`)
    this.$ac_game.append(`<iframe id="frameObj" src="https://yuyao.site" frameborder="0" width="100%" height="100%"/>`)
    this.$h = $('head')
    this.$h.append(`<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`)
    $('#app').parents('.fs-gui-window')[0].style.width = 'calc(390px + 2px)'
    $('#app').parents('.fs-gui-window')[0].style.height = '850px'
    $('#app').parents('.fs-gui-window')[0].style.left = window.innerWidth / 2 - 390 / 2 + 'px'
    $('#app').parents('.fs-gui-window')[0].style.top = 0
    $(window).off('DOMMouseScroll')

    this.message.closeLoadingMessage()

    // 容器父页面js代码
    // * 表示向所有的iframe发送信息，指定url，就可以定向发送信息
    const iframeDom = document.getElementById('frameObj')
    // 需要等iframe加载完成后执行，不然有可能会报错
    iframeDom.onload = function () {
      iframeDom.contentWindow.postMessage(token, '*')
    }
  }
  acapp_login(appid, redirect_uri, scope, state, root) {
    this.root = root
    let outer = this
    this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, (resp) => {
      if (resp.result === 'success') {
        outer.up_js(outer.root, resp.jwt_token)

        // $.ajax({
        //   url: 'https://app842.acapp.acwing.com.cn/jump/setdata',
        //   type: 'GET',
        //   data: {
        //     access: resp.access,
        //     refresh: resp.refresh,
        //   },
        //   success(resp) {
        //     outer.up_js(outer.root)
        //   },
        // })
      }
    })
  }

  getinfo_acapp(root) {
    let outer = this
    $.ajax({
      url: 'https://app3619.acapp.acwing.com.cn/api/music/account/acwing/acapp/apply_code4/',
      type: 'GET',
      success: function (resp) {
        if (resp.result === 'success') {
          outer.acapp_login(resp.appid, resp.redirect_uri, resp.scope, resp.state, root)
        }
      },
    })
  }
}

class message {
  constructor() {
    this.message = document.createElement('div')
    this.message.innerHTML = `
<div class="container-yy">
  <div class="dots-yy three">
    <div class="dot-yy"></div>
    <div class="dot-yy"></div>
    <div class="dot-yy"></div>
  </div>
</div>
        `
    this.message.style.position = 'fixed'
    // 居中
    this.message.style.left = '50%'
    this.message.style.top = '50%'
    this.message.style.transform = 'translate(-50%,-50%)'
    //  z-index:9999999999999
    this.message.style.zIndex = '9999999999999'
    //透明
    this.message.style.backgroundColor = 'rgba(0,0,0,0)'
    this.initCss()
    this.message.style.display = 'none'
    document.body.appendChild(this.message)

    this.errorBox = document.createElement('div')
    this.errorBox.style.position = 'absolute'
    // 居中
    this.errorBox.style.left = '50%'
    this.errorBox.style.top = '50%'
    this.errorBox.style.transform = 'translate(-50%,-50%)'
    this.errorBox.style.zIndex = '9999999999999'
    document.body.appendChild(this.errorBox)
  }

  initCss() {
    //添加css样式表
    const style = document.createElement('style')
    style.innerHTML = `
.container-yy {
  position: absolute;
  top: 50%;
  left: 50%; 
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
 
}
.dots-yy {
  width: 100px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dot-yy {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #0288D1;
}
.dot-yy:nth-child(1) {
  transform: translateX(100%);
  background-color: orange;
  animation: left 1s ease alternate infinite;
}

.dot-yy:nth-child(2) {
  animation: center 1s ease infinite;
}

.dot-yy:nth-child(3) {
  transform: translateX(-100%);
  background-color: green;
  animation: right 1s ease alternate infinite;
}

@keyframes left {
  0% {
    transform: translateX(100%);
  }

  50% {
    transform: translateX(-10%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes right {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(10%);
  }

  100% {
    transform: translateX(-100%);
  }
}

@keyframes center {
  0%,
  100% {
    transform: scale(0.5);
  }

  50% {
    transform: scale(1);
  }
}


.two .dot-yy:nth-child(1) {
  background-color: orange;
  animation: twoleft 1s ease-in alternate infinite;
  transform: translateX(100%);
}

.two .dot-yy:nth-child(2) {
  animation: none;
}

.two .dot-yy:nth-child(3) {
  background-color: green;
  transform: translateX(-100%);
  animation: tworight 1s ease-out alternate infinite;
}

@keyframes twoleft {
  0% {
    transform: translateX(-100%);
  }

  50%,
  100% {
    transform: translateX(100%);
  }
}

@keyframes tworight {
  50% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}


.error-box-yy{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    

}
.error-message-yy{
    min-width: 50vw;
    width: fit-content;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
}

`
    document.head.appendChild(style)
  }

  //加载动画
  loadingMessage() {
    this.message.style.display = 'block'
  }
  //关闭加载动画
  closeLoadingMessage() {
    this.message.style.display = 'none'
  }

  //错误提示
  errorMessage(message) {
    this.errorBox.innerHTML = `
        <div class="error-box-yy">
            <div class="error-message-yy">
                ${message}
            </div>
        </div>
        `
    this.errorBox.style.display = 'block'
    setTimeout(() => {
      this.errorBox.style.display = 'none'
    }, 2000)
  }
}
