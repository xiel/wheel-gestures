import swipeLeftEndBounce from '../fixtures/end-bounce/swipe-left-end-bounce.json'
import { recordPhases } from '../helper/recordPhases'

describe('ignores double bounce', () => {
  it('Mac - Safari', () => {
    expect(recordPhases(swipeLeftEndBounce.wheelEvents)).toMatchSnapshot()
  })
})
