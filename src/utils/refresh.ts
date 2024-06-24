let lastSrc: string //上一次获取到的script地址
let needTip = true // 默认开启提示

const scriptReg = /<script.*src=["'](?<src>[^"']+)/gm

async function extractNewScripts() {
  const html = await fetch('/?_timestamp=' + Date.now()).then((resp) => resp.text())
  scriptReg.lastIndex = 0
  const result = [] as any
  let match: any
  while ((match = scriptReg.exec(html))) {
    result.push(match.groups.src)
  }
  return result
}

async function needUpdate() {
  const newScripts = await extractNewScripts()
  if (!lastSrc) {
    lastSrc = newScripts
    return false
  }
  let result = false
  if (lastSrc.length !== newScripts.length) {
    result = true
  }
  for (let i = 0; i < lastSrc.length; i++) {
    if (lastSrc[i] !== newScripts[i]) {
      result = true
      break
    }
  }
  lastSrc = newScripts
  return result
}
const DURATION = 1000 * 6

export function autoRefresh() {
  setTimeout(async () => {
    const willUpdate = await needUpdate()
    if (willUpdate) {
      const result = confirm('页面有更新，请刷新查看')
      if (result) {
        location.reload()
      }
      needTip = false // 关闭更新提示，防止重复提醒
    }
    if (needTip) {
      autoRefresh()
    }
  }, DURATION)
}
// autoRefresh()
