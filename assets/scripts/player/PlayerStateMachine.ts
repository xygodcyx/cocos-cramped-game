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
import { ENTITY_STATE_ENUM, FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../enums'
import State from '../../base/State'
import { getInitParamNumber, getInitParamTrigger, StateMachine } from '../../base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import { SubStateMachine } from '../../base/SubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import BLockFrontSubStateMachine from './BLockFrontSubStateMachine'
import { EntityManager } from '../../base/EntityManager'

const { ccclass, property } = _decorator

type ParamsValueType = boolean | number
interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM
  value: ParamsValueType
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
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
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamTrigger())
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamTrigger())
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamNumber())
  }
  initStateMachine() {
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BLockFrontSubStateMachine(this))
  }
  initAnimationEvent() {
    this.animateComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animateComponent.defaultClip.name
      const whiteList = ['block', 'turn']
      if (whiteList.some(item => name.includes(item))) {
        this.node.getComponent(EntityManager).state = ENTITY_STATE_ENUM.IDLE
      }
    })
  }
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE): {
        if (this.getParams(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.getParams(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else if (this.getParams(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
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
