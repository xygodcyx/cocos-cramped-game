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
import { SubStateMachine } from './SubStateMachine'
const { ccclass, property } = _decorator

export const getInitParamTrigger = () => ({
  type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
  value: false,
})

export const getInitParamNumber = () => ({
  type: FSM_PARAMS_TYPE_ENUM.NUMBER,
  value: 0,
})

type ParamsValueType = boolean | number
interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: ParamsValueType
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine
  animateComponent: Animation
  params: Map<string, IParamsValue> = new Map()
  stateMachines: Map<string, State | SubStateMachine> = new Map()

  waitingList: Array<Promise<SpriteFrame[]>> = []

  getParams(name: string) {
    if (this.params.get(name)) {
      return this.params.get(name)
    }
  }

  setParams(name: string, value: ParamsValueType) {
    if (this.params.get(name)) {
      this.params.get(name).value = value
      this.run()
      this.resetTrigger()
    }
  }

  get currentState(): State | SubStateMachine {
    return this._currentState
  }
  set currentState(newState: State | SubStateMachine) {
    this._currentState = newState
    this._currentState.run()
  }

  resetTrigger() {
    for (const [_, paramsValue] of this.params) {
      if (paramsValue.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        paramsValue.value = false
      }
    }
  }

  abstract init(): void
  abstract run(): void
}
