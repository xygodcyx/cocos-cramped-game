import { _decorator, Component, Sprite, UITransform } from 'cc'
import {
  DIRECTION_ENUM,
  PARAMS_NAME_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  EVENT_ENUM,
  CONTROLLER_ENUM,
  ENTITY_TYPE_ENUM,
} from '../enums'
import EventManager from '../runtime/EventManager'
import { PlayerStateMachine } from '../scripts/player/PlayerStateMachine'
import { TILE_WIDTH, TILE_HEIGHT } from '../scripts/tile/TileManager'
import { IEntity } from '../levels'
import { StateMachine } from './StateMachine'

const { ccclass, property } = _decorator

@ccclass('EntityManager')
export class EntityManager extends Component {
  x: number = 0
  y: number = 0
  type: ENTITY_TYPE_ENUM
  stateMachine: StateMachine

  private _direction: DIRECTION_ENUM
  public get direction(): DIRECTION_ENUM {
    return this._direction
  }
  public set direction(value: DIRECTION_ENUM) {
    this._direction = value
    this.stateMachine.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[value])
  }

  private _state: ENTITY_STATE_ENUM
  public get state(): ENTITY_STATE_ENUM {
    return this._state
  }

  public set state(value: ENTITY_STATE_ENUM) {
    this._state = value
    this.stateMachine.setParams(value, true)
  }

  init(params: IEntity) {
    const sprite = this.addComponent(Sprite)
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    const transform = this.getComponent(UITransform)
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

    this.type = params.type
    this.direction = params.direction
    this.state = params.state
    this.x = params.x
    this.y = params.y
  }

  protected update(dt: number): void {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_WIDTH * 1.5)
  }
}
