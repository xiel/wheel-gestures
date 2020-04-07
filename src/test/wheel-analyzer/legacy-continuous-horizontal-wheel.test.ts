import { recordPhases } from '../helper/recordPhases'

import macChrome from '../fixtures/legacy-mouse/mac-chrome-continuous-horizontal-wheel-right.json'
import winFF from '../fixtures/legacy-mouse/win-FF-continuous-horizontal-wheel-right.json'
import winChrome from '../fixtures/legacy-mouse/win-Chrome-continuous-horizontal-wheel-right.json'
import winChromeNew from '../fixtures/legacy-mouse/win-chrome-new.json'
import winEdge from '../fixtures/legacy-mouse/win-Edge.json'

describe('continuous-horizontal-wheel-right', () => {
  it('mac - chrome', () => {
    expect(recordPhases(macChrome.wheelEvents)).toMatchSnapshot()
  })

  it('win - FF', () => {
    expect(recordPhases(winFF.wheelEvents)).toMatchSnapshot()
  })

  it('Windows - Chrome', () => {
    expect(recordPhases(winChrome.wheelEvents)).toMatchSnapshot()
  })

  it('Windows - Chrome New', () => {
    expect(recordPhases(winChromeNew.wheelEvents)).toMatchSnapshot()
  })

  it('Windows - Edge', () => {
    expect(recordPhases(winEdge.wheelEvents)).toMatchSnapshot()
  })
})
