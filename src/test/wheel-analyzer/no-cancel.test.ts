import macSafariLeft from '../fixtures/no-cancel/mac-swipe-left-end-bounce.json'
import winRightFast from '../fixtures/no-cancel/win-chrome-fast-right-ptp.json'
import winRight from '../fixtures/no-cancel/win-chrome-right-ptp.json'
import { recordPhases } from '../helper/recordPhases'

describe('no cancel', () => {
  describe('slight increase in delta should not trigger momentum cancel', () => {
    test('Mac - Safari', () => {
      expect(recordPhases(macSafariLeft.wheelEvents)).toMatchSnapshot()
    })

    test('Win - Chrome - swipe right', () => {
      expect(recordPhases(winRight.wheelEvents)).toMatchSnapshot()
    })

    test('Win - Chrome - swipe right fast', () => {
      expect(recordPhases(winRightFast.wheelEvents)).toMatchSnapshot()
    })
  })
})
