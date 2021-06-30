import DB from './db'


const db = new DB()

db.add({
  id: 0,
  title: '- Regular Verbs I - IMABI!',
  source: 'Imabi',
  link: 'https://www.imabi.net/regularverbsi.htm'
},)
db.add({
  id: 1,
  title: 'Verb Basics – Learn Japanese',
  source: 'Tae Kim',
  link: 'http://www.guidetojapanese.org/learn/grammar/verbs'
})
db.add({
  id: 2,
  title: 'Verbs',
  source: 'Bunpou',
  link: 'cheatsheets/verbs'
})

console.log(db.search('verb', ['title']))
