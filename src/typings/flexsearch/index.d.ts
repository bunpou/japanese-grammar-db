declare module 'flexsearch' {
  export interface Dict {
    [key: string]: any
  }
  export type Options = Dict

  export type ID = number

  export interface DataEntry {
    id: number
  }
  export type Data = DataEntry[]

  export class Document {
    constructor(options: Options)
    add(entry: DataEntry): void
    append(entries: Dict | Dict[]): void
    update(entries: Dict | Dict[]): void
    remove(objectToRemove: ID | Document): void
    search(string: string, limit?: string[], options?: Options): Dict
    search(options: Options): Dict
    export(handler: Function): Promise<void>
    import(key: string, data: string): Promise<void>
  }
} 
