export interface IMatch {
  round: number
  record: string
  opponent: string
}

export interface IPlayer {
  id: string
  deckID: string
  opponents?: string[]
  matches?: IMatch[]
  points?: number
  dropped?: boolean
  platforms?: string[]
  queueing?: boolean
}

export interface IEvent {
  id: string
  name: string
  description: string
  platform: string
  date: Date
  time: string
  rounds?: number
  concluded?: boolean
  fired?: boolean
  players?: IPlayer[] | any
  channel?: string
}

export interface IDecklist {
  id?: string
  name?: string
  author: string
  mainboard: string[]
  sideboard?: string[]
}
