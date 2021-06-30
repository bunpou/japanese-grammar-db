const fs = require('fs')
import { Document, ID, Dict, DataEntry, Data, Options } from 'flexsearch'


export default class DB {
  data: Data
  doc: Document
  options: Dict = {
    tokenize: 'full',
    document: {
      id: 'id',
      index: ['title', 'source', 'link']
    }
  }

  constructor (dataImportPath?: string, docImportPath?: string, options?: Options) {
    this.options = options || this.options
    this.data = dataImportPath ? this.importData(dataImportPath) : this.emptyData()
    this.doc = docImportPath ? this.importDoc(docImportPath) : this.emptyDoc(options)
  }

  emptyData (): Data {
    return []
  }

  importData (path: string): Data {
    return this.readJSON(path) as Data
  }

  exportData (path: string) {
    this.writeJSON(path, this.data)
  }

  emptyDoc (options?: Options): Document {
    options = options || this.options

    return new Document(options)
  }

  importDoc (path: string, options?: Options): Document {
    options = options || this.options
    const db = this.emptyDoc(options)

    const json: Object = this.readJSON(path)
    for (const [key, value] of Object.entries(json)) {
      db.import(key, value)
    }

    return db
  }

  exportDoc (path: string, options?: Options) {
    options = options || this.options
    const exportData: Dict = {}

    this.doc.export((key: string, data: any) => {
      exportData[key] = data
  
      if (key === 'store') this.writeJSON(path, exportData)
    })
  }

  readJSON (path: string): Dict {
    return JSON.parse(fs.readFileSync(path))
  }

  writeJSON (filename: string, data: Dict) {
    fs.writeFileSync(filename, JSON.stringify(data))
  }

  add(entry: DataEntry): void {
    this.data[entry.id] = entry
    this.doc.add(entry)
  }

  remove(id: ID): void {
    delete this.data[id]
    this.doc.remove(id)
  }

  search(string?: string, limit?: string[], options?: Options): Dict {return this.doc.search(string, limit, options)}
}
