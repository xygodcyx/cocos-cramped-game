import Singleton from '../base/Singleton'
import { EVENT_ENUM } from '../enums'
import { IMap } from '../levels'

interface IItem {
  func: Function
  ctx?: unknown
}

export default class EventManager extends Singleton {
  eventMap: Map<EVENT_ENUM, Array<IItem>> = new Map()

  public static get Instance() {
    return this.GetInstance<EventManager>()
  }

  on(key: EVENT_ENUM, func: Function, ctx?: unknown) {
    if (!this.eventMap.has(key)) {
      this.eventMap.set(key, [])
    }
    this.eventMap.get(key).push({ func, ctx })
  }
  off(key: EVENT_ENUM, func: Function) {
    if (!this.eventMap.has(key)) {
      return
    }
    const index = this.eventMap.get(key).findIndex(i => i.func === func)
    if (index === -1) {
      return
    }
    this.eventMap.get(key).splice(index, 1)
  }
  emit(key: EVENT_ENUM, ...params: unknown[]) {
    if (!this.eventMap.has(key)) {
      return
    }
    this.eventMap.get(key).forEach(({ func, ctx }) => {
      ctx ? func.apply(ctx, params) : func(...params)
    })
  }
  clear() {
    this.eventMap.clear()
  }
}
