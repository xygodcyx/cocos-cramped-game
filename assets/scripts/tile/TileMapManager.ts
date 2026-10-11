import { _decorator, Component, Layers, Node, resources, sp, Sprite, SpriteFrame, UITransform } from 'cc'
import levels from '../../levels'
import { TileManager } from './TileManager'
import { createUINode, randomByRange } from '../../utils'
import DataManager from '../../runtime/DataManager'
import ResourcesManager from '../../runtime/ResourcesManager'
const { ccclass, property } = _decorator
export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    const spriteFrames = await ResourcesManager.Instance.loadRes('texture/tile/tile')
    const mapInfo = DataManager.Instance.mapInfo
    DataManager.Instance.tileInfo = []
    for (let x = 0; x < DataManager.Instance.mapColumnCount; x++) {
      const column = mapInfo[x]
      DataManager.Instance.tileInfo[x] = []
      for (let y = 0; y < DataManager.Instance.mapRowCount; y++) {
        const tile = column[y]
        if (tile.src === null || tile.type === null) {
          continue
        }
        let number = tile.src
        if ((number === 1 || number === 5 || number === 9) && x % 2 === 0 && y % 2 === 0) {
          number += randomByRange(0, 4)
        }
        const spriteFrame = spriteFrames.find(sf => sf.name === `tile (${number})`)
        const node = createUINode()
        const tileManager = node.addComponent(TileManager)
        const type = tile.type
        tileManager.init(type, x, y, spriteFrame)
        DataManager.Instance.tileInfo[x][y] = tileManager
        this.node.addChild(node)
      }
    }
  }
}
