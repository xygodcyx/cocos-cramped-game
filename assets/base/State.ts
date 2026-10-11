import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import ResourcesManager from '../runtime/ResourcesManager'
import { StateMachine } from './StateMachine'
const ANIMATION_SPEED = 1 / 8

export default class State {
  animationClip: AnimationClip
  constructor(
    private stateMachine: StateMachine,
    private animatePath: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
  ) {
    this.init()
  }
  async init() {
    const promise = ResourcesManager.Instance.loadRes(this.animatePath)
    this.stateMachine.waitingList.push(promise)
    const spriteFrames = await promise

    this.animationClip = new AnimationClip()

    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item, i) => [ANIMATION_SPEED * i, item])
    track.channel.curve.assignSorted(frames)

    this.animationClip.addTrack(track)

    this.animationClip.name = this.animatePath
    this.animationClip.duration = ANIMATION_SPEED * frames.length
    this.animationClip.wrapMode = this.wrapMode
  }
  run() {
    this.stateMachine.animateComponent.defaultClip = this.animationClip
    this.stateMachine.animateComponent.play()
  }
}
