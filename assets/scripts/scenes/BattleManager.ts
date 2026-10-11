import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from '../tile/TileMapManager'
import { createUINode } from '../../utils'
import DataManager from '../../runtime/DataManager'
import levels from '../../levels'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import EventManager from '../../runtime/EventManager'
import { EVENT_ENUM } from '../../enums'
import { PlayerManager } from '../player/PlayerManager'
import { WoodenSkeletonManager } from '../woodenSkeleton/WoodenSkeletonManager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  stage: Node
  tileMap: Node

  async start() {
    this.generateStage()
    this.initLevel()
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }

  protected onDestroy() {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }
  async initLevel() {
    const level = levels[`level${DataManager.Instance.levelIndex}`]
    if (!level) {
      return
    }
    DataManager.Instance.mapInfo = level.mapInfo
    DataManager.Instance.mapColumnCount = DataManager.Instance.mapInfo.length
    DataManager.Instance.mapRowCount = DataManager.Instance.mapInfo[0].length
    await this.generateTileMap()
    await this.generateEnemy()
    await this.generatePlayer()
  }

  generateStage() {
    this.stage = createUINode()
    this.stage.setParent(this.node)
  }

  async generateTileMap() {
    this.tileMap = createUINode()
    this.tileMap.setParent(this.stage)
    const tileMapManger = this.tileMap.addComponent(TileMapManager)
    await tileMapManger.init()
    this.adaptPos()
  }

  async generatePlayer() {
    const player = createUINode()
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    await playerManager.init()
    DataManager.Instance.player = playerManager
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN)
  }
  async generateEnemy() {
    const enemy = createUINode()
    enemy.setParent(this.stage)
    const enemyManager = enemy.addComponent(WoodenSkeletonManager)
    await enemyManager.init()
    DataManager.Instance.enemies.push(enemyManager)
  }
  async nextLevel() {
    DataManager.Instance.levelIndex++
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
    await this.initLevel()
  }

  adaptPos() {
    const { mapColumnCount, mapRowCount } = DataManager.Instance
    this.stage.setPosition(-(mapColumnCount * TILE_WIDTH) / 2, (mapRowCount * TILE_HEIGHT) / 2 + 80)
  }
}
