/** @format */

import { customRef } from 'vue'

export const debounceRef = <T>(value: T, delay = 200) => {
  let timer: any
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue: T) {
        clearTimeout(timer)
        timer = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}
