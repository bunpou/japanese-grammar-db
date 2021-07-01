const needle = require('needle')
import { Dict } from 'flexsearch'


export default abstract class Parser {
  abstract parse (): Promise<Dict[]>

  getPageBody (url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      needle(url, function (err: Error, res: any) {
        if (err) reject(err)
  
        if (res.statusCode === 200) {
          resolve(res.body)
        } else {
          reject(Error(res.statusCode))
        }
      })
    })
  }
}
