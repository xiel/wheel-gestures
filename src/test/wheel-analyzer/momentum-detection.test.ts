import { recordPhases } from '../helper/recordPhases'
import swipeRight from '../fixtures/swipe-right.json'
import swipeRightFast from '../fixtures/swipe-right-fast.json'

describe('momentum detection recognizes', () => {
  it('swipe right', () => {
    expect(recordPhases(swipeRight.wheelEvents)).toMatchSnapshot()
  })

  it('swipe right - fast', () => {
    expect(recordPhases(swipeRightFast.wheelEvents)).toMatchSnapshot()
  })
})
