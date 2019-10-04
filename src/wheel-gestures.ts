import { WheelAnalyzer } from './wheel-analyzer'

interface Props {}

export default function WheelGestures(props: Props) {
  const wheelAnalyzer = new WheelAnalyzer()

  return Object.freeze({
    wheelAnalyzer,
  })
}
