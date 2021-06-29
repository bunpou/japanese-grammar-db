import {Document as FSDocument} from 'flexsearch'


export default class DB {
  doc: FSDocument
  options: {} = {
    tokenize: 'full',
    document: {
      id: 'id',
      index: ['title', 'source', 'link']
    }
  }

  constructor (importPath: string = null, options: {} = null) {
    this.options = options || this.options
    this.doc = importPath ? this.import(importPath) : this.empty(options)
  }

  empty (options: {} = null): FSDocument {
    options = options || this.options
    return new FSDocument(options)
  }

  import (path: string, options: {} = null): FSDocument {
    options = options || this.options
    const db = new FSDocument(options)

    const data: Object = this.readJSON(path)
    for (const [key, value] of Object.entries(data)) {
      db.import(key, value)
    }

    return db
  }

  export (path: string, options: {} = null) {
    options = options || this.options

    const exportData: Object = {}

    this.doc.export((key: string, data: any) => {
      exportData[key] = data
  
      if (key === 'store') this.writeJSON(path, exportData)
    })
  }

  readJSON (path: string): Object {
    return {}
  }

  writeJSON (path: string) {}
}