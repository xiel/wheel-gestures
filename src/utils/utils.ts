export function lastOf<T>(array: T[]) {
  return array[array.length - 1]
}

export function average(numbers: number[]) {
  return numbers.reduce((a, b) => a + b) / numbers.length
}
