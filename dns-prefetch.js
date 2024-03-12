import fs from 'fs'
import { glob } from 'glob'
import urlRegex from 'url-regex'

const urlPattern = /(https?:\/\/[^/]*)/i
const urls = new Set()
//遍历dist目录下的所有html,css,js文件
const searchDomain = async () => {
  const files = await glob('dist/**/*.{html,css,js}')
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8')
    const matches = content.match(urlRegex({ strict: true }))
    if (matches) {
      matches.forEach((url) => {
        const match = url.match(urlPattern)
        if (match && match[1]) {
          urls.add(match[1])
        }
      })
    }
  }
}
const insertLike = async () => {
  const files = await glob('dist/**/*.html')
  const links = [...urls].map((url) => `<link rel="dns-prefetch" href="${url}">`).join('\n')
  for (const file of files) {
    const hml = fs.readFileSync(file, 'utf-8')
    const result = hml.replace(/<head>/, `<head>\n${links}`)
    fs.writeFileSync(file, result, 'utf-8')
  }
}

const main = async () => {
  await searchDomain()
  await insertLike()
}
main()
