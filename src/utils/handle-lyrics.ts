import { ILyric } from '@/types/lyric'

interface IReturnLyric {
  lyric: ILyric[]
}

// 空白数量
const emptyLyricNum = 7

export const formatMusicLyrics = (lyric?: string): IReturnLyric => {
  lyric = lyric?.trim()
  if (lyric === '') {
    return { lyric: [{ time: 0, lyric: '这个地方没有歌词！', uid: 520520 }] }
  }
  const lyricObjArr: ILyric[] = [] // 最终生成的歌词数组

  // 将歌曲字符串变成数组，数组每一项就是当前歌词信息
  const lineLyric: any = lyric?.split(/\n/)

  // 匹配中括号里正则的
  //匹配两位数字+冒号+两位数字+点+两到三位数字
  const regTime = /\d{2}:\d{2}.\d{2,3}/

  // 循环遍历歌曲数组
  for (let i = 0; i < lineLyric?.length; i++) {
    if (lineLyric[i] === '') continue
    const time: number | undefined = formatLyricTime((lineLyric[i].match(regTime) || '')[0])
    if (time === undefined) continue
    if (lineLyric[i].split(']')[1] !== '') {
      lyricObjArr.push({
        time: time,
        lyric: lineLyric[i].split(']')[1],
        uid: parseInt(Math.random().toString().slice(-6)),
      })
    }
  }
  // 开头结尾加上空白 *
  for (let i = 0; i < emptyLyricNum; i++) {
    lyricObjArr.unshift({
      time: 0,
      lyric: '',
      uid: parseInt(Math.random().toString().slice(-6)),
    })
    lyricObjArr.push({
      time: 99999,
      lyric: '',
      uid: parseInt(Math.random().toString().slice(-6)),
    })
  }
  return {
    lyric: lyricObjArr,
  }
}

const formatLyricTime = (time: string) => {
  if (!time) return
  const regMin = /.*:/
  const regSec = /:.*\./
  const regMs = /\./

  const min = parseInt((time.match(regMin) as any)[0].slice(0, 2))
  let sec = parseInt((time.match(regSec) as any)[0].slice(1, 3))
  const ms = time.slice((time.match(regMs) as any).index + 1, (time.match(regMs) as any).index + 3)
  if (min !== 0) {
    sec += min * 60
  }
  return Number(sec + '.' + ms)
}
