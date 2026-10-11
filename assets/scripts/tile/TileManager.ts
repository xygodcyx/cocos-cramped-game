import { _decorator, Component, Layers, Node, resources, sp, Sprite, SpriteFrame, UITransform } from 'cc'
import levels from '../../levels'
import { TILE_TYPE_ENUM } from '../../enums'
const { ccclass, property } = _decorator
export const TILE_WIDTH = 55

export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  moveable: boolean
  turnable: boolean
  async init(type: TILE_TYPE_ENUM, i: number, j: number, spriteFrame: SpriteFrame) {
    this.type = type
    this.initAble()
    const sprite = this.node.addComponent(Sprite)
    sprite.spriteFrame = spriteFrame
    const transform = this.node.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }

  initAble() {
    if (
      this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
      this.type === TILE_TYPE_ENUM.WALL_ROW ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
    ) {
      this.moveable = false
      this.turnable = false
    } else if (
      this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.moveable = false
      this.turnable = true
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.moveable = true
      this.turnable = true
    }
  }

  loadRes(res: string): Promise<SpriteFrame[]> {
    return new Promise((resolve, reject) => {
      resources.loadDir(res, SpriteFrame, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  }
}
