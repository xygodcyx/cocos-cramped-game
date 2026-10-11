import { AnimationClip } from 'cc'
import { DIRECTION_ENUM, PARAMS_NAME_ENUM, DIRECTION_ORDER_ENUM } from '../enums'
import State from './State'
import { StateMachine } from './StateMachine'
import { SubStateMachine } from './SubStateMachine'

const prefix = 'texture/player/idle'

export default class DirectionSubStateMachine extends SubStateMachine {
  run(): void {
    const value = this.stateMachine.getParams(PARAMS_NAME_ENUM.DIRECTION).value
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}
