export interface Doc {
  id: string
  type: string
  source: string
  title: string
  abstract: string
  assigned_at: string
  indexings?: Code[]
}

export interface Code {
  id: string
  type: string
  term: string
  description: string
}
