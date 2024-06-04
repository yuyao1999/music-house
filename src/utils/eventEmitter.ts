/** @format */

const eventNames = ['update', 'close', 'del_follow'] as const
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
}

export default new EventEmitter()

//使用
// eventEmitter.on('update', () => {
//   console.log('update')
// })

// eventEmitter.emit('update')
