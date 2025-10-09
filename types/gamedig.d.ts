declare module 'gamedig' {
  export interface Player {
    name: string
    raw?: any
  }

  export interface QueryResult {
    name: string
    map: string | null
    password: boolean
    maxplayers: number
    players: Player[]
    bots?: Player[]
    connect: string
    ping: number
    query?: any
    raw?: any
    version?: string
    description?: string
  }

  export interface QueryOptions {
    type: string
    host: string
    port?: number
    maxRetries?: number
    socketTimeout?: number
    givenPortOnly?: boolean
  }

  export function query(options: QueryOptions): Promise<QueryResult>
}

