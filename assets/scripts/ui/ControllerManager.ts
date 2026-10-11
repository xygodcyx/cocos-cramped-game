import { _decorator, Component } from 'cc'
import EventManager from '../../runtime/EventManager'
import { CONTROLLER_ENUM, EVENT_ENUM } from '../../enums'

const { ccclass, property } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleControl(evt: Event, dir: CONTROLLER_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, dir)
  }
}
