// calculateValues :: Object -> String -> Object
const calculateValues = (initValues) => (q) => {
  if (q === null || q === '')
    return Object.keys(initValues).reduce(
      (last_obj, key) => ({ ...last_obj, [key]: -1 }), // -1 on all values if skipped question
      {}
    )
  else {
    const latestChoice = { [q]: 1 } // 1 if picked
    return { ...initValues, ...latestChoice } // build values with default
  }
}

// calculateValuesArray :: Object -> Array -> Object
const calculateValuesArray = (initValues) => (q) => {
  if ((q || []).length === 0)
    return Object.keys(initValues).reduce(
      (last_obj, key) => ({ ...last_obj, [key]: -1 }), // -1 on all values if skipped question
      {}
    )
  else {
    const latestChoice = q.reduce(
      (last_obj, key) => ({ ...last_obj, [key]: 1 }),
      {}
    ) // 1 if picked
    return { ...initValues, ...latestChoice } // build values with default
  }
}

// calculateValuesMultiple :: Object -> (Array,Array,Array) -> Object
const calculateValuesMultiple = (initValues) => (q, q2, q3) => {
  if (
    (q || []).length === 0 &&
    (q2 || []).length === 0 &&
    (q3 || []).length === 0
  )
    return Object.keys(initValues).reduce(
      (last_obj, key) => ({ ...last_obj, [key]: -1 }), // -1 on all values if skipped question
      {}
    )
  else {
    let latestChoice = {}
    if (q.length > 0) {
      q.map((key) => {
        latestChoice = { ...latestChoice, [key]: 1 }
      })
    }
    if (q2.length > 0) {
      q2.map((key) => {
        if (latestChoice.hasOwnProperty(key))
          latestChoice = {
            ...latestChoice,
            [key]: parseInt(`${latestChoice[key]}2`, 10),
          }
        else latestChoice = { ...latestChoice, [key]: 2 }
      })
    }
    if (q3.length > 0) {
      q3.map((key) => {
        if (latestChoice.hasOwnProperty(key))
          latestChoice = {
            ...latestChoice,
            [key]: parseInt(`${latestChoice[key]}3`, 10),
          }
        else latestChoice = { ...latestChoice, [key]: 3 }
      })
    }

    return { ...initValues, ...latestChoice } // build values with default
  }
}

// calculateValuesMultipleText :: Object -> (String,String,String) -> Object
const calculateValuesMultipleText = (initValues) => (q, q2, q3) => {
  if (
    (q === null || q === '') &&
    (q2 === null || q2 === '') &&
    (q3 === null || q3 === '')
  )
    return Object.keys(initValues).reduce(
      (last_obj, key) => ({ ...last_obj, [key]: -1 }), // -1 on all values if skipped question
      {}
    )
  else {
    let latestChoice = {}
    if (q !== null && q !== '') {
      latestChoice = { ...latestChoice, [q]: 1 }
    }
    if (q2 !== null && q2 !== '') {
      if (latestChoice.hasOwnProperty(q2))
        latestChoice = {
          ...latestChoice,
          [q2]: parseInt(`${latestChoice[q2]}2`, 10),
        }
      else latestChoice = { ...latestChoice, [q2]: 2 }
    }
    if (q3 !== null && q3 !== '') {
      if (latestChoice.hasOwnProperty(q3))
        latestChoice = {
          ...latestChoice,
          [q3]: parseInt(`${latestChoice[q3]}3`, 10),
        }
      else latestChoice = { ...latestChoice, [q3]: 3 }
    }

    return { ...initValues, ...latestChoice } // build values with default
  }
}

//q70
function getSelfEthicist(latest, data) {
  const initVal = {
    Yes: 0,
    No: 0,
  }

  const values = calculateValues(initVal)(latest.q70)
  const template = {
    q: 'do you identify as an ethicist?',
    parent: 'self-ethicist',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions]
}

//q71
function getOthersEthicist(latest, data) {
  const initVal = {
    Yes: 0,
    No: 0,
  }

  const values = calculateValues(initVal)(latest.q71)

  const template = {
    q: 'do others identify you as an ethicist?',
    parent: 'others-ethicist',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions]
}

// q14
function getFunding(latest, data) {
  const initVal = {
    Yes: 0,
    No: 0,
  }

  const values = calculateValues(initVal)(latest.q14)

  const template = {
    q: 'are you paid for your work on AI/data ethics?',
    parent: 'paid work',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions]
}

// q7
function getYearsInField(latest, data) {
  const initVal = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0,
    31: 0,
    32: 0,
    33: 0,
    34: 0,
    35: 0,
    36: 0,
    37: 0,
    38: 0,
    39: 0,
    40: 0,
    41: 0,
    42: 0,
    43: 0,
    44: 0,
    45: 0,
    46: 0,
    47: 0,
    48: 0,
    49: 0,
    50: 0,
    '50+': 0,
  }

  const values = calculateValues(initVal)(latest.q7)

  const template = {
    q: 'years',
    parent: 'years in field',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions]
}

// q9
function getEducation(latest, data) {
  const initVal = {
    '#agriculture': 0,
    '#architecture': 0,
    '#biology': 0,
    '#business': 0,
    '#computer science': 0,
    '#data science': 0,
    '#design & art': 0,
    '#economics': 0,
    '#education': 0,
    '#engineering & technology': 0,
    '#health': 0,
    '#history': 0,
    '#information management': 0,
    '#languages': 0,
    '#law': 0,
    '#mathematics': 0,
    '#media': 0,
    '#environmental science': 0,
    '#politics': 0,
    '#psychology': 0,
    '#philosophy': 0,
    '#social sciences': 0,
    '#sports': 0,
    '#other': 0,
  }

  const values = calculateValuesArray(initVal)(latest.q9) // q9 is Array

  const template = {
    q: 'education',
    parent: 'education',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions].map((it) => ({
    ...it,
    name: it.name.replace('#', ''),
  }))
}

// q65
function getCareer(latest, data) {
  const initVal = {
    'Undergraduate student': 0,
    'Masters student': 0,
    'PhD student': 0,
    Postdoc: 0,
    'University faculty': 0,
    'Industry employee': 0,
    'Government employee': 0,
    'Non-profit employee': 0,
    'Other: (please describe below)': 0,
  }

  const values = calculateValues(initVal)(latest.q65)

  const template = {
    q: 'career',
    parent: 'career path',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions].map((it) => ({
    ...it,
    name: it.name === 'Other: (please describe below)' ? 'Other' : it.name,
  }))
}

// q30 q133 q149
function getTopics(latest, data) {
  const initVal = {
    '#bias': 0,
    '#fairness': 0,
    '#accountability': 0,
    '#transparency': 0,
    '#explainability': 0,
    other: 0,
  }

  const values = calculateValuesMultiple(initVal)(
    latest.q30,
    latest.q133,
    latest.q149
  )

  const template = {
    q: 'topic',
    parent: 'topics',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions].map((it) => ({
    ...it,
    name: it.name.replace('#', ''),
  }))
}

// q33 q139 q155
function getDomain(latest, data) {
  const initVal = {
    health: 0,
    finance: 0,
    'urban dynamics': 0,
    transport: 0,
    military: 0,
    'social media': 0,
    'welfare and social care': 0,
    policing: 0,
    'judicial system': 0,
    accessibility: 0,
    education: 0,
    other: 0,
    'N/A': 0,
  }

  const values = calculateValuesMultiple(initVal)(
    latest.q33,
    latest.q139,
    latest.q155
  )

  const template = {
    q: 'domain',
    parent: 'domain',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions]
  //     .map((it) => ({
  //     ...it,
  //     name: it.name.replace('#', ''),
  // }))
}

// q37 q143 q159
function getOutput(latest, data) {
  const initVal = {
    '#academic papers': 0,
    '#reports': 0,
    '#policy-papers': 0,
    '#policy briefing': 0,
    '#blog posts': 0,
    '#exhibitions': 0,
    '#events': 0,
    '#datasets': 0,
    '#website': 0,
    '#code repository': 0,
    '#software application': 0,
    '#other': 0,
  }

  const values = calculateValuesMultiple(initVal)(
    latest.q37,
    latest.q143,
    latest.q159
  )

  const template = {
    q: 'output',
    parent: 'outputs',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions].map((it) => ({
    ...it,
    name: it.name.replace('#', ''),
  }))
}

// q51 q144 q160
function getAudience(latest, data) {
  const initVal = {
    '#internal audience': 0,
    '#academics': 0,
    '#think tanks': 0,
    '#NGOs': 0,
    '#government institutions': 0,
    '#artists': 0,
    '#designers': 0,
    '#industry': 0,
    '#community organizations': 0,
    '#general public': 0,
    '#other': 0,
  }

  const values = calculateValuesMultiple(initVal)(
    latest.q51,
    latest.q144,
    latest.q160
  )

  const template = {
    q: 'audience',
    parent: 'audiences',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions].map((it) => ({
    ...it,
    name: it.name.replace('#', ''),
  }))
}

// q35 q141 q157
function getCollabType(latest, data) {
  const initVal = {
    'Yes, within my organization': 0,
    'Yes, with others outside my organization': 0,
    'Yes, both within and outside my organization': 0,
    No: 0,
  }

  const values = calculateValuesMultipleText(initVal)(
    latest.q35,
    latest.q141,
    latest.q157
  )

  const template = {
    q: 'collab type?',
    parent: 'collab type',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions]
}

// q36 q142 q158
function getCollabField(latest, data) {
  const initVal = {
    'Researchers - Social Science': 0,
    'Researchers - Humanities': 0,
    'Researchers - Law': 0,
    'Researchers - Medicine': 0,
    'Researchers - Science': 0,
    'Artists and creative practitioners': 0,
    'Computer/Data Scientists': 0,
    'Tech developers and Engineers': 0,
    'General public': 0,
    Regulators: 0,
    NGOs: 0,
    'Affected individuals': 0,
    'Government officials': 0,
    'Community organizations': 0,
    'Industry representatives': 0,
    'Others:': 0,
  }

  const values = calculateValuesMultiple(initVal)(
    latest.q36,
    latest.q142,
    latest.q158
  )

  const template = {
    q: 'collab field?',
    parent: 'collab field',
  }

  let needDefault = Object.keys(values)

  const generated = data.map(({ answer, count }) => {
    const val = values[answer]
    if (typeof val === 'undefined') {
      throw new Error(
        `Missing value type, make sure to add all possible values. value searched: (${answer})`
      )
    }
    // removing values which are taken from db
    needDefault = needDefault.filter((it) => it !== answer)

    return {
      ...template,
      value: val,
      name: answer,
      total: count,
    }
  })

  // In the situation where there are not even 1 answer for certain option,
  // we need to add default for this option which is not in db

  const defaultOptions = needDefault.map((it) => ({
    ...template,
    value: values[it],
    name: it,
    total: 0,
  }))

  return [...generated, ...defaultOptions].map((it) => ({
    ...it,
    name: it.name === 'Others:' ? 'Other' : it.name,
  }))
}

module.exports = {
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
}
