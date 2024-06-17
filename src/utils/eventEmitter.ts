/** @format */

console.log('refreshHead')
console.log('refreshHead')
const eventNames = ['update', 'close', 'refreshHead', 'refreshHeadImg', 'refreshHeadDb'] as const
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listeners: Record<EventNames, Set<Function>> = Object.fromEntries(
    eventNames.map((name) => [name, new Set()])
  ) as Record<EventNames, Set<Function>>
  on(eventNames: EventNames, listener: Function) {
    this.listeners[eventNames].add(listener)
  }
  emit(eventNames: EventNames, ...args: any[]) {
    this.listeners[eventNames].forEach((listener) => listener(...args))
  }
  // 在组件中 会触发多次 解决这个问题
  once(eventNames: EventNames, listener: Function) {
    this.listeners[eventNames].clear()
    this.on(eventNames, listener)
  }
}

export default new EventEmitter()

//使用
// eventEmitter.on('update', () => {
//   console.log('update')
// })

// eventEmitter.emit('update')
