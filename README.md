# ![wheel gestures](./WheelGestures.svg)

wheel gestures and momentum detection in the browser

🚧 `IN DEVELOPMENT` still testing and doing heaps of breaking changes, don't use yet please :)

[![npm (tag)](https://img.shields.io/npm/v/wheel-gestures/latest.svg)](https://www.npmjs.com/package/wheel-gestures)
![GitHub top language](https://img.shields.io/github/languages/top/xiel/wheel-gestures.svg)

you bring the wheel events, wheelAnalyzer returns wheel gestures & momentum information


**OS & Browsers**

- Mac OS (Chrome, Firefox, Safari, Brave, Edge), Magic Mouse, Magic Trackpad
- Windows (testing needed & help appreciated), Microsoft Precision Touchpads
- Linux (testing needed & help appreciated)

### Prior Art

There were people before me who also thought that it might be helpful for some interactions to be able to distinguish between user initiated wheel events and the ones that are triggered by inertia scroll, but none of the other known libraries delivered results in the precision I needed, so I developed my own solution. Honourable mentions:

- https://github.com/promo/wheel-indicator
- https://github.com/d4nyll/lethargy
