declare module 'flexsearch' {
  export interface Dict {
    [key: string]: any
  }

  export type ID = number

  export class Document {
    constructor(options: Dict)
    add(entries: Dict | Dict[]): void
    append(entries: Dict | Dict[]): void
    update(entries: Dict | Dict[]): void
    remove(objectToRemove: ID | Document): void
    search(string: string, limit?: string[], options?: Dict): Dict
    search(options: Dict): Dict
    export(handler: Function): Promise<void>
    import(key: string, data: string): Promise<void>
  }
} 
