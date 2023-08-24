/** @format */

class message {
  private message: any
  private errorBox: any
  constructor() {
    this.message = document.createElement("div")
    this.message.innerHTML = `
<div class="container-yy">
  <div class="dots-yy three">
    <div class="dot-yy"></div>
    <div class="dot-yy"></div>
    <div class="dot-yy"></div>
  </div>
</div>
        `
    this.message.style.position = "absolute"
    // 居中
    this.message.style.left = "50%"
    this.message.style.top = "50%"
    this.message.style.transform = "translate(-50%,-50%)"
    //  z-index:9999999999999
    this.message.style.zIndex = "9999999999999"
    //透明
    this.message.style.backgroundColor = "rgba(0,0,0,0)"
    this.initCss()
    this.message.style.display = "none"
    document.body.appendChild(this.message)

    this.errorBox = document.createElement("div")
    this.errorBox.style.position = "absolute"
    // 居中
    this.errorBox.style.left = "50%"
    this.errorBox.style.top = "50%"
    this.errorBox.style.transform = "translate(-50%,-50%)"
    this.errorBox.style.zIndex = "9999999999999"
    document.body.appendChild(this.errorBox)
  }

  initCss() {
    //添加css样式表
    const style = document.createElement("style")
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
  public loadingMessage() {
    this.message.style.display = "block"
  }
  //关闭加载动画
  public closeLoadingMessage() {
    this.message.style.display = "none"
  }

  //错误提示
  public errorMessage(message: string) {
    this.errorBox.innerHTML = `
        <div class="error-box-yy">
            <div class="error-message-yy">
                ${message}
            </div>
        </div>
        `
    this.errorBox.style.display = "block"
    setTimeout(() => {
      this.errorBox.style.display = "none"
    }, 2000)
  }
}

export default new message()
