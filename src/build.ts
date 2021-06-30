const path = require('path')
const needle = require('needle')
const cheerio = require('cheerio')
import { DataEntry, Dict, Data } from 'flexsearch'

import DB from './db'


const dbPath = path.resolve(__dirname, '../build/db.json')
const docPath = path.resolve(__dirname, '../build/doc.json')


async function main () {
  const db = new DB()

  const data = await getData()
  data.forEach((entry: DataEntry)  => {
    db.add(entry)
  })

  db.exportData(dbPath)
  db.exportDoc(docPath)
}

async function getData (): Promise<Data> {
  const results: Dict[] = await parse()

  let counter = 0
  const data: Data = results.map((result: Dict) => {
    result.id = counter++
    return result as DataEntry
  })

  return data
}

async function parse (): Promise<Dict[]> {
  return (await parseImabi()).concat(parseTaeKim())
}

function parseImabi (): Promise<Dict[]> {
  return new Promise ((resolve, reject) => {
    const url = 'https://www.imabi.net/tableofcontents.htm'

    getPageBody(url)
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

function getPageBody (url: string): Promise<string> {
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

function parseTaeKim (): Dict {
  const results: Dict[] = []
  const $ = cheerio.load(getTaeKimBody())

  $('a').each(function () {
    const link = $(this).attr('href')
    const title = $(this).text()

    if (!link.includes('category')) {
      results.push({
        link: link,
        title: title,
        source: 'Tae Kim'
      })
    }
  })

  return results
}

function getTaeKimBody (): string {
  return `<div id="collapsCat-8:3" style="display:block">
  <ul><li class="collapsing categories expandable"><span class="collapsing categories expand"><span class="sym">►</span><a href="http://www.guidetojapanese.org/learn/category/grammar-guide/grammar-start/" title="View all posts filed under Before you start">Before you start</a></span>
  <div id="collapsCat-10:3" style="display:none">
            </div>
           </li> <!-- ending subcategory -->
  <li class="collapsing categories expandable"><span class="collapsing categories expand"><span class="sym">►</span><a href="http://www.guidetojapanese.org/learn/category/grammar-guide/the-writing-system/" title="View all posts filed under The Writing System">The Writing System</a></span>
  <div id="collapsCat-12:3" style="display:none">
            </div>
           </li> <!-- ending subcategory -->
  <li class="collapsing categories expandable parent active"><span class="collapsing categories collapse"><span class="sym">▼</span><a href="http://www.guidetojapanese.org/learn/category/grammar-guide/basic-grammar/" title="View all posts filed under Basic Grammar">Basic Grammar</a></span>
  <div id="collapsCat-14:3" style="display:block">
  <ul><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/basic" title="Chapter Overview">Chapter Overview</a></li>
  <li class="collapsing categories item self"><a href="http://www.guidetojapanese.org/learn/grammar/stateofbeing" title="Expressing state-of-being">Expressing state-of-being</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/stateofbeing_ex" title="State-of-being Practice Exercises">State-of-being Practice Exercises</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/particlesintro" title="Introduction to Particles">Introduction to Particles</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/particlesintro_ex" title="Particle Practice Exercises">Particle Practice Exercises</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/adjectives" title="Adjectives">Adjectives</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/adjectives_ex" title="Adjective Practice Exercises">Adjective Practice Exercises</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/verbs" title="Verb Basics">Verb Basics</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/verbs_ex" title="Verb Practice Exercises">Verb Practice Exercises</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/negativeverbs" title="Negative Verbs">Negative Verbs</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/negativeverbs_ex" title="Negative Verb Practice Exercises">Negative Verb Practice Exercises</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/past_tense" title="Past Tense">Past Tense</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/pasttense_ex" title="Past Verb Practice Exercises">Past Verb Practice Exercises</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/verbparticles" title="Particles used with verbs">Particles used with verbs</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/in-transitive" title="Transitive and Intransitive Verbs">Transitive and Intransitive Verbs</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/clause" title="Relative Clauses and Sentence Order">Relative Clauses and Sentence Order</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/nounparticles" title="Noun-related Particles">Noun-related Particles</a></li>
  <li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/adverbs" title="Adverbs and Sentence-ending particles">Adverbs and Sentence-ending particles</a></li>
  </ul>          </div>
           </li> <!-- ending subcategory -->
  <li class="collapsing categories expandable"><span class="collapsing categories collapse"><span class="sym">▼</span><a href="http://www.guidetojapanese.org/learn/category/grammar-guide/essential-grammar/" title="View all posts filed under Essential Grammar">Essential Grammar</a></span>
  <div id="collapsCat-15:3" style=""><ul><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/essential" title="Chapter Overview">Chapter Overview</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/polite" title="Polite Form and Verb Stems">Polite Form and Verb Stems</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/people" title="Addressing People">Addressing People</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/question" title="The Question Marker">The Question Marker</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/compound" title="Compound Sentences">Compound Sentences</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/teform" title="Other uses of the te-form">Other uses of the te-form</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/potential" title="Potential Form">Potential Form</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/surunaru" title="Using する and なる with the に particle">Using する and なる with the に particle</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/conditionals" title="Conditionals">Conditionals</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/must" title="Expressing &quot;must&quot; or &quot;have to&quot;">Expressing "must" or "have to"</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/desire" title="Desire and Suggestions">Desire and Suggestions</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/actionclause" title="Acting on relative clauses">Acting on relative clauses</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/define" title="Defining and Describing">Defining and Describing</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/try" title="Trying or attempting something">Trying or attempting something</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/favors" title="Giving and Receiving">Giving and Receiving</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/requests" title="Making Requests">Making Requests</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/numbers" title="Numbers and Counting">Numbers and Counting</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/slang" title="Casual Patterns and Slang">Casual Patterns and Slang</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/sentence_ending" title="Review and more sentence-ending particles">Review and more sentence-ending particles</a></li></ul></div>
           </li> <!-- ending subcategory -->
  <li class="collapsing categories expandable"><span class="collapsing categories collapse"><span class="sym">▼</span><a href="http://www.guidetojapanese.org/learn/category/grammar-guide/special-expressions/" title="View all posts filed under Special Expressions">Special Expressions</a></span>
  <div id="collapsCat-16:3" style=""><ul><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/specialexpressions" title="Chapter Overview">Chapter Overview</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/causepass" title="Causative and Passive Verbs">Causative and Passive Verbs</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/honorific" title="Honorific and Humble Forms">Honorific and Humble Forms</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/unintended" title="Unintended Actions">Unintended Actions</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/genericnouns" title="Special Expressions with Generic Nouns">Special Expressions with Generic Nouns</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/certainty" title="Various degrees of certainty">Various degrees of certainty</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/amount" title="Expressing Amounts">Expressing Amounts</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/similarity" title="Similarity or hearsay">Similarity or hearsay</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/comparison" title="Using 「方」 and 「よる」">Using 「方」 and 「よる」</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/easyhard" title="Actions that are easy or hard to do">Actions that are easy or hard to do</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/negativeverbs2" title="More negative verbs">More negative verbs</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/reasoning" title="Hypothesizing and Concluding">Hypothesizing and Concluding</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/timeactions" title="Time-specific actions">Time-specific actions</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/nochange" title="Expressing a lack of change">Expressing a lack of change</a></li></ul></div>
           </li> <!-- ending subcategory -->
  <li class="collapsing categories expandable"><span class="collapsing categories collapse"><span class="sym">▼</span><a href="http://www.guidetojapanese.org/learn/category/grammar-guide/advanced-topics/" title="View all posts filed under Advanced Topics">Advanced Topics</a></span>
  <div id="collapsCat-17:3" style=""><ul><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/advanced" title="Chapter Overview">Chapter Overview</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/formal" title="Formal Expressions">Formal Expressions</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/should" title="Things that should be a certain way">Things that should be a certain way</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/even" title="The minimum expectation">The minimum expectation</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/signs" title="Showing signs of something">Showing signs of something</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/feasibility" title="Expressing non-feasibility">Expressing non-feasibility</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/tendency" title="Tendencies">Tendencies</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/volitional2" title="Advanced Volitional">Advanced Volitional</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/covered" title="Covered by something">Covered by something</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/immedate" title="Immediate Events">Immediate Events</a></li><li class="collapsing categories item"><a href="http://www.guidetojapanese.org/learn/grammar/other" title="Other Grammar">Other Grammar</a></li></ul></div>
           </li> <!-- ending subcategory -->
  </ul>        </div>`
}

main()
