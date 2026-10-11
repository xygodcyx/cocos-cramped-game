import { resources, SpriteFrame } from 'cc'
import Singleton from '../base/Singleton'
import { IMap } from '../levels'
import { sortSpriteFrames } from '../utils'

export default class ResourcesManager extends Singleton {
  public static get Instance() {
    return this.GetInstance<ResourcesManager>()
  }

  loadRes(res: string): Promise<SpriteFrame[]> {
    return new Promise((resolve, reject) => {
      resources.loadDir(res, SpriteFrame, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(sortSpriteFrames(data))
      })
    })
  }
}
