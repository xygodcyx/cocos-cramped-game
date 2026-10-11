import { AnimationClip } from 'cc'
import State from '../../base/State'
import { StateMachine } from '../../base/StateMachine'
import { SubStateMachine } from '../../base/SubStateMachine'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../../enums'
import DirectionSubStateMachine from '../../base/DirectionSubStateMachine'

const prefix = 'texture/player/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(stateMachine: StateMachine) {
    super(stateMachine)
    this.stateMachines.set(
      DIRECTION_ENUM.TOP,
      new State(this.stateMachine, `${prefix}/top`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.BOTTOM,
      new State(this.stateMachine, `${prefix}/bottom`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.LEFT,
      new State(this.stateMachine, `${prefix}/left`, AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.RIGHT,
      new State(this.stateMachine, `${prefix}/right`, AnimationClip.WrapMode.Loop),
    )
  }
}
