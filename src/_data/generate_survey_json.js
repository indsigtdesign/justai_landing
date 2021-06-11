const SUPA = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const {
  getSelfEthicist,
  getOthersEthicist,
  getFunding,
  getYearsInField,
  getEducation,
  getCareer,
  getTopics,
  getDomain,
  getOutput,
  getAudience,
  getCollabType,
  getCollabField,
} = require('../js/reshape-data-node.js')

dotenv.config() // load env
const api = SUPA.createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLIC_KEY
)

const main = async () => {
  // fire up promises
  const dataP = api
    .from('data')
    .select()
    .order('created_time', { ascending: false })
    .limit(1)
    .single()
  const countP = api.from('data').select('id', { count: 'exact' })
  const q70P = api.from('group_by_70').select()
  const q71P = api.from('group_by_71').select()
  const q65P = api.from('group_by_65').select()
  const q14P = api.from('group_by_14').select()
  const q7P = api.from('group_by_7').select()
  const q9P = api.from('group_by_9').select()

  const q30q133q149P = api.from('group_by_30_133_149').select()
  const q33q139q155P = api.from('group_by_33_139_155').select()
  const q37q143q159P = api.from('group_by_37_143_159').select()
  const q51q144q160P = api.from('group_by_51_144_160').select()
  const q35q141q157P = api.from('group_by_35_141_157').select()
  const q36q142q158P = api.from('group_by_36_142_158').select()

  // await the promises
  // data :: Object
  const { data: data, error: err } = await dataP
  const { error: err1, count } = await countP
  const { data: q70, error: err2 } = await q70P
  const { data: q71, error: err3 } = await q71P
  const { data: q65, error: err4 } = await q65P
  const { data: q14, error: err5 } = await q14P
  const { data: q7, error: err6 } = await q7P
  const { data: q9, error: err7 } = await q9P

  const { data: q30_q133_q149, error: err8 } = await q30q133q149P
  const { data: q33_q139_q155, error: err9 } = await q33q139q155P
  const { data: q37_q143_q159, error: err10 } = await q37q143q159P
  const { data: q51_q144_q160, error: err11 } = await q51q144q160P
  const { data: q35_q141_q157, error: err12 } = await q35q141q157P
  const { data: q36_q142_q158, error: err13 } = await q36q142q158P

  const error =
    err ||
    err1 ||
    err2 ||
    err3 ||
    err4 ||
    err5 ||
    err6 ||
    err7 ||
    err8 ||
    err9 ||
    err10 ||
    err11 ||
    err12 ||
    err13

  if (error) {
    console.error('API-ERROR:\n', error)
    return
  }

  //identity
  const selfEthicist = getSelfEthicist(data, q70) // :: Array
  const othersEthicist = getOthersEthicist(data, q71) // :: Array
  const funding = getFunding(data, q14) // :: Array
  const yearsInField = getYearsInField(data, q7) // :: Array
  const education = getEducation(data, q9) // :: Array
  const career = getCareer(data, q65) // :: Array

  //theme
  const topic = getTopics(data, q30_q133_q149) // :: Array
  const domain = getDomain(data, q33_q139_q155) // :: Array
  const output = getOutput(data, q37_q143_q159) // :: Array
  const audience = getAudience(data, q51_q144_q160) // :: Array
  const collabtype = getCollabType(data, q35_q141_q157) // :: Array
  const collabfield = getCollabField(data, q36_q142_q158) // :: Array

  const result = {
    name: '',
    children: [
      {
        name: 'identity',
        children: [
          { name: 'self-ethicist', children: selfEthicist },
          { name: 'others-ethicist', children: othersEthicist },
          { name: 'paid work', children: funding },
          { name: 'years in field', children: yearsInField },
          { name: 'education', children: education },
          { name: 'career path', children: career },
        ],
      },
      {
        name: 'theme',
        children: [
          { name: 'topics', children: topic },
          { name: 'domain', children: domain },
          { name: 'outputs', children: output },
          { name: 'audiences', children: audience },
          { name: 'collab type', children: collabtype },
          { name: 'collab field', children: collabfield },
        ],
      },
      { responses: count },
    ],
  }

  return result
}

module.exports = main
