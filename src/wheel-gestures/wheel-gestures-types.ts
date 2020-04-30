import { PhaseData } from '..'

export interface WheelDragState extends PhaseData {
  down: boolean
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
