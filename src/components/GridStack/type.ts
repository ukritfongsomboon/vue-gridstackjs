export type modelItem = {
  id: string
  x: number | undefined
  y: number | undefined
  w: number
  h: number
  autoPosition?: boolean
  type: string
  options?: string
  title?: string
}

export type modelItems= modelItem[]
