export function getRandom(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getToken(header: string): string {
  return header.split(' ')[1]
}
