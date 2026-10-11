import { _decorator, Animation } from 'cc'
import { EntityManager } from '../../base/EntityManager'
import { StateMachine, getInitParamTrigger, getInitParamNumber } from '../../base/StateMachine'
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM, ENTITY_STATE_ENUM } from '../../enums'
import WoodenSkeletonIdleSubStateMachine from './WoodenSkeletonIdleSubStateMachine'
import WoodenSkeletonAttackSubStateMachine from './WoodenSkeletonAttackSubStateMachine'

const { ccclass, property } = _decorator

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  async init() {
    this.animateComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachine()
    this.initAnimationEvent()
    await Promise.all(this.waitingList)
  }

  resetTrigger() {
    for (const [_, paramsValue] of this.params) {
      if (paramsValue.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        paramsValue.value = false
      }
    }
  }

  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamTrigger())
    this.params.set(PARAMS_NAME_ENUM.ATTACK, getInitParamTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamNumber())
  }
  initStateMachine() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new WoodenSkeletonIdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.ATTACK, new WoodenSkeletonAttackSubStateMachine(this))
  }
  initAnimationEvent() {
    this.animateComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animateComponent.defaultClip.name
      const whiteList = ['attack']
      if (whiteList.some(item => name.includes(item))) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE): {
        if (this.getParams(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.getParams(PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.ATTACK)
        } else {
          this.currentState = this.currentState
        }
        break
      }
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
