import { executeQuery } from "../database/database.js"

// total number of topics
const countTopics = async () => {
  const res = await executeQuery(`SELECT COUNT(*) AS count FROM topics
`);

return res.rows[0].count
}

// total number of questions
const countQuestions = async () => {
  const res = await executeQuery(`SELECT COUNT(*) AS count FROM questions
`);

return res.rows[0].count
}

// total number of question answers
const countAnswers= async () => {
  const res = await executeQuery(`SELECT COUNT(*) AS count FROM question_answers
`);

return res.rows[0].count
}

export {countAnswers, countQuestions, countTopics}