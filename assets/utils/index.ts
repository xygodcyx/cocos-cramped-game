import { Layers, UITransform, Node, SpriteFrame } from 'cc'

export function createUINode(name?: string): Node {
  const node = new Node(name)
  const transform = node.addComponent(UITransform)
  transform.setAnchorPoint(0, 1)
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}

export function randomByRange(start: number, end: number): number {
  return Math.floor(start + (end - start) * Math.random())
}

function getNumberWithString(str: string): number {
  return parseInt(str.match(/\((\d+)\)/)[1] || '0')
}

export function sortSpriteFrames(spriteFrames: Array<SpriteFrame>): Array<SpriteFrame> {
  return spriteFrames.sort((a, b) => getNumberWithString(a.name) - getNumberWithString(b.name))
}
