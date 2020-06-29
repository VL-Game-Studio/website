export interface ILeague extends IPlayer {}

export interface ISignup {
  id: string
  player: string
  username?: string
  name?: string
  mainboard: string[]
  sideboard?: string[]
}

export interface IResult {
  id: string
  playerID: string
  result: string
}

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
  dropped?: boolean
  platforms?: string[]
  points?: number
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

export interface IDecklist extends IDeck {
  id?: string
  author: string
}
