/**
 * <p> 获取加载图片地址 </p>
 * examples: bg/bg.png
 * @param imgPath: string
 */
export const requireImg = (imgPath: string) => {
  return new URL(`../assets/${imgPath}`, import.meta.url).href
}
