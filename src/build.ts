const path = require('path')
import { DataEntry, Dict, Data } from 'flexsearch'

import DB from './db'
import Parser from './parser'
import ImabiParser from './parsers/imabi'
import TaeKimParser from './parsers/tae-kim'


export default class DBBuilder {
  private _db: DB = new DB()
  private _dbPath: string
  private _docPath: string
  private _parsers: Parser[] = []

  get dbPath () {
    return this._dbPath
  }

  set dbPath (value: string) {
    this._dbPath = value
  }

  get docPath () {
    return this._docPath
  }

  set docPath (value: string) {
    this._docPath = value
  }


  constructor (db?: DB) {
    this._db = db || this._db
  }

  addParser (parser: Parser) {
    this._parsers.push(parser)
  }

  async getData (): Promise<Data> {
    const results: Dict[] = (await this.processParsers()).reduce((x, y) => x.concat(y), [])

    let counter = 0
    const data: Data = results.map((result: Dict) => {
      result.id = counter++
      return result as DataEntry
    })

    return data
  }

  async processParsers (): Promise<Dict[][]> {
    return Promise.all(this._parsers.map((parser: Parser) => parser.parse()))
  }

  async build () {
    const data = await this.getData()

    data.forEach((entry: DataEntry)  => {
      this._db.add(entry)
    })

    this._db.exportData(this._dbPath)
    this._db.exportDoc(this._docPath)
  }
}


function main () {
  const dbBuilder = new DBBuilder()

  dbBuilder.dbPath = path.resolve(__dirname, '../build/db.json')
  dbBuilder.docPath = path.resolve(__dirname, '../build/doc.json')

  dbBuilder.addParser(new ImabiParser())
  dbBuilder.addParser(new TaeKimParser())

  dbBuilder.build()
}

if (typeof require !== 'undefined' && require.main === module) {
  main();
}
