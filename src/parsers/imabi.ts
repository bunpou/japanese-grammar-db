const cheerio = require('cheerio')
import Parser from "../parser"
import { Dict } from 'flexsearch'


export default class ImabiParser extends Parser {
  parse (): Promise<Dict[]> {
    return new Promise ((resolve, reject) => {
      const url = 'https://www.imabi.net/tableofcontents.htm'
  
      this.getPageBody(url)
        .then((body) => {
          const results: Dict[] = []
          const $ = cheerio.load(body)
  
          $('p a').each(function () {
            const link = $(this).attr('href')
            const title = $(this).text()
  
            if (title.includes('第')) {
              results.push({
                link: link,
                title: title,
                source: 'Imabi'
              })
            }
          })
  
          resolve(results)
        })
        .catch((error: Error) => reject(error))
    })
  }
}
