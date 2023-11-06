/**
 * @description 获取图片主色调
 * @param {string} url 图片地址
 * @returns {Promise<string>} 图片主色调
 */
export const getImgColor = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx: any = canvas.getContext('2d')
      if (!ctx) {
        reject('2d context is not supported')
      }
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, img.width, img.height).data
      const r = []
      const g = []
      const b = []
      for (let i = 0; i < data.length; i += 4) {
        r.push(data[i])
        g.push(data[i + 1])
        b.push(data[i + 2])
      }
      const rResult = Math.floor(r.reduce((a, b) => a + b) / r.length)
      const gResult = Math.floor(g.reduce((a, b) => a + b) / g.length)
      const bResult = Math.floor(b.reduce((a, b) => a + b) / b.length)
      // 如果太暗则往上提高
      if (rResult < 150 && gResult < 150 && bResult < 150) {
        resolve(`rgb(${rResult + 90}, ${gResult + 120}, ${bResult + 100})`)
      }

      resolve(`rgb(${rResult}, ${gResult}, ${bResult})`)
    }
  })
}
/**
 * 从主色调中获取#010207 相近的颜色
 */
export const getDarkColor = (color: string): string => {
  if (!color) {
    return '#010207'
  }
  const colorArr = color.split(',')
  const r = Number(colorArr[0].split('(')[1])
  const g = Number(colorArr[1])
  const b = Number(colorArr[2].split(')')[0])
  const rResult = r - 100 < 0 ? 0 : r - 160
  const gResult = g - 100 < 0 ? 0 : g - 160
  const bResult = b - 100 < 0 ? 0 : b - 160
  return `rgb(${rResult}, ${gResult}, ${bResult})`
}
