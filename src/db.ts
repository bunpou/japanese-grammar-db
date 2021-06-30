import { Document, ID, Dict } from 'flexsearch'


export default class DB {
  data: Document
  options: Dict = {
    tokenize: 'full',
    document: {
      id: 'id',
      index: ['title', 'source', 'link']
    }
  }

  constructor (importPath: string = null, options: Dict = null) {
    this.options = options || this.options
    this.data = importPath ? this.import(importPath) : this.empty(options)
  }

  empty (options: Dict = null): Document {
    options = options || this.options
    return new Document(options)
  }

  import (path: string, options: Dict = null): Document {
    options = options || this.options
    const db = new Document(options)

    const data: Object = this.readJSON(path)
    for (const [key, value] of Object.entries(data)) {
      db.import(key, value)
    }

    return db
  }

  export (path: string, options: Dict = null) {
    options = options || this.options

    const exportData: Dict = {}

    this.data.export((key: string, data: any) => {
      exportData[key] = data
  
      if (key === 'store') this.writeJSON(path, exportData)
    })
  }

  readJSON (path: string): Dict {
    return {}
  }

  writeJSON (path: string, data: Dict) {}

  add(entries: Dict | Dict[]): void {this.data.add(entries)}
  append(entries: Dict | Dict[]): void {this.data.append(entries)}
  update(entries: Dict | Dict[]): void {this.data.update(entries)}
  remove(objectToRemove: ID | Document): void {this.data.remove(objectToRemove)}
  search(string?: string, limit?: string[], options?: Dict): Dict {return this.data.search(string, limit, options)}
}
