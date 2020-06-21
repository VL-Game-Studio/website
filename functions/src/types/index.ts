export interface IMatch {
  round: number
  record: string
  opponent: string
}

interface IDeck {
  name?: string
  mainboard: string[]
  sideboard?: string[]
}

export interface IPlayer {
  id: string
  deck?: IDeck
  deckID?: string
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
  closed?: boolean
  description: string
  platform: string
  date: Date
  time: number | string
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
