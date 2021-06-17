import { dendro } from './dendro.js'
import { wheel } from './wheels.js'

// check for email / id
const urlparams = new URLSearchParams(document.location.search.substring(1))

const getEmail = () => {
  const emailURI = urlparams.get('email')
  if (emailURI && emailURI !== 'undefined' && emailURI !== 'null')
    return decodeURIComponent(emailURI)
  else return false
}

const getID = () => {
  const idURI = urlparams.get('id')
  if (idURI && idURI !== 'undefined' && idURI !== 'null')
    return decodeURIComponent(idURI)
  else return false
}

const email = getEmail()
const id = getID()

if (!(email || id)) {
  d3.json('./data/data.json')
    .then(function (data) {
      dendro(data, true)
      wheel(data, true)
    })
    .catch(console.error)
}
