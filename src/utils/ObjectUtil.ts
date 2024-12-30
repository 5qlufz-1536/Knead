export const mapEntries = <A, A1>(obj: Record<string, A>, fn: (value: A, key: string) => A1): Record<string, A1> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value, key)]),
  )
}
