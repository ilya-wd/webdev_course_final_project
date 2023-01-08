import { executeQuery } from "../database/database.js"

const addAnswerOption = async(qId, text, isCorrect) => {
  await executeQuery("INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($qId, $text, $isCorrect);", {
    qId: qId,
    text: text,
    isCorrect: isCorrect
  })
}

const findAnswerByQuestionTextCorrect = async(qId, text, isCorrect) => {
  const res = await executeQuery("SELECT * FROM question_answer_options WHERE question_id= $qId AND option_text = $text AND is_correct = $isCorrect", {
    qId: qId,
    text: text,
    isCorrect: isCorrect
  })

  return res.rows[0]
}

const deleteAnswerOption = async(id) => {
  await executeQuery("DELETE FROM question_answer_options WHERE id = $id;", {
    id: +id
  });
}

const deleteQuestionAnswers = async(id) => {
  await executeQuery("DELETE FROM question_answers WHERE question_answer_option_id  = $id;", {
    id: +id
  });
}

export {addAnswerOption, deleteAnswerOption, deleteQuestionAnswers, findAnswerByQuestionTextCorrect}