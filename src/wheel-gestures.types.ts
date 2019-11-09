export interface WheelDragState {
  down: boolean
  delta: number[]
}

export enum WheelReason {
  USER = 'USER',
  ANY = 'ANY'
}

type WheelDragHandler = (state: WheelDragState) => void

export type WheelGesturesEventMap = {
  wheelpan: WheelDragState
  // wheelswipe: { dir: string }
}
