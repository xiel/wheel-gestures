export function lastOf<T>(array: T[]) {
  return array[array.length - 1]
}

export function average(numbers: number[]) {
  return numbers.reduce((a, b) => a + b) / numbers.length
}

export function addVectors<T extends number[]>(v1: T, v2: T): T {
  if (v1.length !== v2.length) {
    throw new Error('vectors must be same length')
  }
  return v1.map((val, i) => val + v2[i]) as T
}

export function absMax(numbers: number[]) {
  return Math.max(...numbers.map(Math.abs))
}
