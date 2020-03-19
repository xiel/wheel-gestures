export function rubberband(min: number, max: number, current: number, reduceRatio = 0.5) {
  if (current > max) {
    const overflow = current - max
    return current - overflow * reduceRatio
  } else if (current < min) {
    const underflow = min - current
    return current + underflow * reduceRatio
  }
  return current
}
