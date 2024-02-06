/**
 * @param {number} time 时间
 * @returns {string} 格式化后的时间
 * @description 格式化时间 传入秒数  返回 00:00
 */
export const formatTime = (time: number | undefined): string => {
  if (!time) return '00:00'
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)
  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

/**
 * @param {number} nowTime 当前时间
 * @param {number} totalTime 总时间
 * @returns {number} 进度条百分比
 * @description 计算进度条百分比
 */
export const getPercent = (nowTime: number, totalTime: number): number => {
  if (!nowTime || !totalTime) return 0
  return (nowTime / totalTime || 0) * 100
}

/**
 * @param {number} percent 进度条百分比
 * @param {number} totalTime 总时间
 * @returns {number} 当前时间
 * @description 根据进度条百分比计算当前时间
 */
export const getNowTime = (percent: number, totalTime: number): number => {
  if (!percent || !totalTime) return 0
  return percent * totalTime
}

/**
 * @param {Data} data 时间
 * @returns {string} 格式化后的时间 yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (data: Date | undefined | string): string => {
  if (!data) return ''
  if (typeof data === 'string') {
    data = new Date(data)
  }
  const year = data.getFullYear()
  const month = data.getMonth() + 1
  const day = data.getDate()
  const hour = data.getHours()
  const minute = data.getMinutes()
  const second = data.getSeconds()
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${
    minute < 10 ? '0' + minute : minute
  }:${second < 10 ? '0' + second : second}`
}
