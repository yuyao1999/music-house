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
      // 如果是黑色的话，分界线是 100
      if (rResult < 100 && gResult < 100 && bResult < 100) {
        resolve('#2CF2FE')
      }

      resolve(`rgb(${rResult}, ${gResult}, ${bResult})`)
    }
  })
}
