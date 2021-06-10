class SurveyJson {
  data() {
    return {
      permalink: '/data/data.json',
    }
  }

  render({ generate_survey_json }) {
    return JSON.stringify(generate_survey_json)
  }
}

module.exports = SurveyJson
