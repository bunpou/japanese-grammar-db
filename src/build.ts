const path = require('path')
import { DataEntry, Dict, Data } from 'flexsearch'
import DB from './db'


const dbPath = path.resolve(__dirname, '../build/db.json')
const docPath = path.resolve(__dirname, '../build/doc.json')


const db = new DB()

const data = getData()
data.forEach((entry: DataEntry)  => {
  db.add(entry)
})

db.exportData(dbPath)
db.exportDoc(docPath)


function getData (): Data {
  const results: Dict[] = parseImabi().concat(parseTaeKim())

  let counter = 0
  const data: Data = results.map((result: Dict) => {
    result.id = counter++
    return result as DataEntry
  })

  return data
}

function parseImabi (): Dict[] {
  const results: Dict[] = []

  results.push({
    title: '- Regular Verbs I - IMABI!',
    source: 'Imabi',
    link: 'https://www.imabi.net/regularverbsi.htm'
  })

  return results
}

function parseTaeKim (): Dict[] {
  const results: Dict[] = []

  results.push({
    title: 'Verb Basics – Learn Japanese',
    source: 'Tae Kim',
    link: 'http://www.guidetojapanese.org/learn/grammar/verbs'
  })

  return results
}
