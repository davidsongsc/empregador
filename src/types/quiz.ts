export type Option = {
  label: string
  value: Record<string, number>
}

export type Question = {
  id: string
  text: string
  options: Option[]
}

export type Profile = {
  id: string
  name: string
  description: string
}