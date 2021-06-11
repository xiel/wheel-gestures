# ![wheel gestures](./WheelGestures.svg)

<h1 align="center">WheelGestures</h1>
<p align="center">
  wheel gestures and momentum detection in the browser
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/wheel-gestures" rel="nofollow"><img src="https://camo.githubusercontent.com/da238eaad5556c489501f93369cd209a2e7e4351/68747470733a2f2f696d672e736869656c64732e696f2f6e706d2f762f776865656c2d67657374757265732f6c61746573742e737667" alt="npm (tag)" data-canonical-src="https://img.shields.io/npm/v/wheel-gestures/latest.svg" style="max-width:100%;"></a>
  <a href="https://bundlephobia.com/result?p=wheel-gestures@2.1.1" rel="nofollow"><img src="https://camo.githubusercontent.com/7d96deb09bd6d0a2f58a54d94eeaf2dcf0891b42/68747470733a2f2f62616467656e2e6e65742f62756e646c6570686f6269612f6d696e7a69702f776865656c2d6765737475726573" alt="only about 2kb minified and gzipped" data-canonical-src="https://badgen.net/bundlephobia/minzip/wheel-gestures" style="max-width:100%;"></a>
</p>

<hr/>

## Installation

Install wheel-gestures using your package manager:

```sh
yarn add wheel-gestures # OR npm install wheel-gestures
```

## Usage 

Import and create an instance of WheelGestures and then add the element you want to observe.

````TypeScript
import { WheelGestures } from 'wheel-gestures'

// create an instance per element
const wheelGestures = WheelGestures()

// find and observe the element the user can interact with
const element = window.document.querySelector('.slider')
wheelGestures.observe(element)

// add your event callback 
wheelGestures.on('wheel', (wheelEventState) => {
  //...
})
````

There are [options](https://wheel-gestures.xiel.dev/docs/options/) to customize the behaviour.

#### WheelEventState

This is the TypeScript type of the WheelEventState object provided. Even if you do not use TypeScript, this might be helpful to see how the data is provided:

````TypeScript
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
````

Read more in the [docs](https://wheel-gestures.xiel.dev).

**OS & Browsers**

- Mac OS (Chrome, Firefox, Safari, Edge), Magic Mouse, Magic Trackpad
- Windows (Chrome, Firefox, Edge), Microsoft Precision Touchpads

#### Prior Art

Other people also thought that it might be helpful for some interactions to be able to distinguish between user initiated wheel events and the ones that are triggered by inertia scroll, but none of the other known libraries delivered results in the precision I needed, so I developed my own solution. Honourable mentions:

- https://github.com/promo/wheel-indicator
- https://github.com/d4nyll/lethargy
