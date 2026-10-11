import {
  _decorator,
  animation,
  AnimationClip,
  Animation,
  Component,
  sp,
  Sprite,
  SpriteFrame,
  UITransform,
  Vec3,
} from 'cc'
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../enums'
import State from './State'
import { StateMachine } from './StateMachine'
const { ccclass, property } = _decorator

export abstract class SubStateMachine extends Component {
  private _currentState: State
  stateMachines: Map<string, State> = new Map()

  constructor(public stateMachine: StateMachine) {
    super()
  }

  get currentState() {
    return this._currentState
  }
  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }

  abstract run(): void
}
