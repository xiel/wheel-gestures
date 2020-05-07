test('exports', () => {
  const WheelGestureExports = require('../../index')

  expect(WheelGestureExports.default.name).toEqual('WheelGestures')

  // freeze in snapshot to check export changes/regressions
  expect(WheelGestureExports).toMatchInlineSnapshot(`
    Object {
      "WheelGestures": [Function],
      "absMax": [Function],
      "addVectors": [Function],
      "average": [Function],
      "clamp": [Function],
      "deepFreeze": [Function],
      "default": [Function],
      "lastOf": [Function],
      "projection": [Function],
    }
  `)
})
