export interface WheelDragState {
  down: boolean
  delta: number[]
  axisVelocity: [number, number]
}

export enum WheelReason {
  USER = 'USER',
  ANY = 'ANY',
}

export type WheelGesturesEventMap = {
  wheelstart: WheelDragState
  wheelmove: WheelDragState
  wheelend: WheelDragState
}
