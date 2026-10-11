import EventManager from '../../runtime/EventManager'
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../../enums'
import ResourcesManager from '../../runtime/ResourcesManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager'
import { _decorator, Component, math, Sprite, UITransform } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import DataManager from '../../runtime/DataManager'
import { WoodenSkeletonStateMachine } from './WoodenSkeletonStateMachine'

const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
  async init() {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    this.stateMachine = this.addComponent(WoodenSkeletonStateMachine)
    await this.stateMachine.init()

    super.init({
      x: 7,
      y: 6,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      type: ENTITY_TYPE_ENUM.ENEMY,
    })

    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE, this.onDirChange, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE, this.onAttack, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onDirChange, this)
  }

  protected onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE, this.onDirChange)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE, this.onAttack)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onDirChange)
  }

  onDirChange() {
    if (!DataManager.Instance.player) {
      return
    }

    const { x: playerX, y: playerY } = DataManager.Instance.player
    const { x, y } = this
    const disX = Math.abs(playerX - x)
    const disY = Math.abs(playerY - y)

    if (disX === disY) {
      return
    }

    let newDirection: DIRECTION_ENUM

    if (playerX >= x && playerY <= y) {
      newDirection = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.RIGHT
    } else if (playerX <= x && playerY <= y) {
      newDirection = disY > disX ? DIRECTION_ENUM.TOP : DIRECTION_ENUM.LEFT
    } else if (playerX <= x && playerY >= y) {
      newDirection = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.LEFT
    } else if (playerX >= x && playerY >= y) {
      newDirection = disY > disX ? DIRECTION_ENUM.BOTTOM : DIRECTION_ENUM.RIGHT
    }
    if (newDirection === this.direction) {
      return
    }
    this.direction = newDirection
  }

  onAttack() {
    if (!DataManager.Instance.player) {
      return
    }

    const { x: playerX, y: playerY } = DataManager.Instance.player
    const { x, y } = this
    const disX = Math.abs(playerX - x)
    const disY = Math.abs(playerY - y)

    if (disX + disY <= 1) {
      this.state = ENTITY_STATE_ENUM.ATTACK
    }
  }

  protected update(dt: number): void {
    super.update(dt)
  }
}
