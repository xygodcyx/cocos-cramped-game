import { AnimationClip } from 'cc'
import State from '../../base/State'
import { StateMachine } from '../../base/StateMachine'
import { SubStateMachine } from '../../base/SubStateMachine'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../../enums'
import DirectionSubStateMachine from '../../base/DirectionSubStateMachine'

const prefix = 'texture/woodenskeleton/attack'

export default class WoodenSkeletonAttackSubStateMachine extends DirectionSubStateMachine {
  constructor(stateMachine: StateMachine) {
    super(stateMachine)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(this.stateMachine, `${prefix}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(this.stateMachine, `${prefix}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(this.stateMachine, `${prefix}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(this.stateMachine, `${prefix}/right`))
  }
}
