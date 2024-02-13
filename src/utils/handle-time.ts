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
 * @param {Data} date 时间
 * @returns {string} 格式化后的时间 yyyy-MM-dd hh:mm:ss
 */
export const formatDate = (date: Date | undefined | string): string => {
  if (!date) return ''
  if (typeof date === 'string') {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${
    minute < 10 ? '0' + minute : minute
  }:${second < 10 ? '0' + second : second}`
}

/**
 * 时间转化器 返回时间差
 * 小于1分钟返回刚刚
 *  小于1小时返回分钟
 * 小于1天返回小时
 * 大于1天 YYYY-MM-DD
 */
export const timeConverter = (time: string): string => {
  const now = new Date().getTime()
  const old = new Date(time).getTime()
  const diff = (now - old) / 1000
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + '小时前'
  } else {
    return formatDate(time).split(' ')[0]
  }
}
