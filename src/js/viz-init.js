import { dendro } from './dendro.js'
import { wheel } from './wheels.js'

d3.json('./data/data.json')
  .then(function (data) {
    dendro(data)
    wheel(data)
  })
  .catch(console.error)
