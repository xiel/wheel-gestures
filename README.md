# WheelGestures

## 🚧 Disclaimer

This project is a fork of https://github.com/xiel/wheel-gestures. It solely exists to fix some problems with type imports. The original package seems to be abandoned, thus the fork and republish.

## Installation

Install `@maas/wheel-gestures` using your package manager:

```sh
pnpm install @maas/wheel-gestures # OR npm install @maas/wheel-gestures
```

## Usage

Import and create an instance of WheelGestures and then add the element you want to observe.

```TypeScript
import { WheelGestures } from '@maas/wheel-gestures'

// create an instance per element
const wheelGestures = WheelGestures()

// find and observe the element the user can interact with
const element = window.document.querySelector('.slider')
wheelGestures.observe(element)

// add your event callback
wheelGestures.on('wheel', (wheelEventState) => {
  //...
})
```

There are [options](https://wheel-gestures.xiel.dev/docs/options/) to customize the behaviour.

#### WheelEventState

This is the TypeScript type of the WheelEventState object provided. Even if you do not use TypeScript, this might be helpful to see how the data is provided:

```TypeScript
export type VectorXYZ = [number, number, number]

export interface WheelEventState {
  isStart: boolean
  isMomentum: boolean
  isEnding: boolean
  isMomentumCancel: boolean
  axisDelta: VectorXYZ
  axisVelocity: VectorXYZ
  axisMovement: VectorXYZ
  axisMovementProjection: VectorXYZ
  event: WheelEvent | WheelEventData
  previous?: WheelEventState
}
```

Read more in the [docs](https://wheel-gestures.xiel.dev).

**OS & Browsers**

- Mac OS (Chrome, Firefox, Safari, Edge), Magic Mouse, Magic Trackpad
- Windows (Chrome, Firefox, Edge), Microsoft Precision Touchpads
