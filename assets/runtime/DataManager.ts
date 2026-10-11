import Singleton from '../base/Singleton'
import { IMap } from '../levels'
import { PlayerManager } from '../scripts/player/PlayerManager'
import { TileManager } from '../scripts/tile/TileManager'
import { WoodenSkeletonManager } from '../scripts/woodenSkeleton/WoodenSkeletonManager'

export default class DataManager extends Singleton {
  mapInfo: IMap = []
  mapRowCount: number = 0
  mapColumnCount: number = 0
  tileInfo: Array<TileManager[]> = []

  levelIndex: number = 1
  player: PlayerManager
  enemies: Array<WoodenSkeletonManager> = []

  public static get Instance() {
    return this.GetInstance<DataManager>()
  }

  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.player = null
    this.enemies = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}
