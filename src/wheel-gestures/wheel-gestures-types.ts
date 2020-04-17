export interface WheelDragState {
  down: boolean
  axisMovement: number[]
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
