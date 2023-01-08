import { executeQuery } from '../database/database.js';

const listTopics = async () => {
  const res = await executeQuery(`SELECT * FROM topics
   ORDER BY name ASC;
`);

  return res.rows;
};

const listQuestionsForTopic = async (topicId) => {
  const res = await executeQuery(
    'SELECT * FROM questions WHERE topic_id = $topicId',
    {
      topicId: topicId,
    }
  );

  return res.rows;
};

const getCorrectOption = async (oId) => {
  const res = await executeQuery(
    'SELECT * FROM question_answer_options WHERE id = $oId',
    {
      oId: oId,
    }
  );

  return res;
};

const getCorrectOptionByQuestion = async (qId) => {
  const res = await executeQuery(
    'SELECT * FROM question_answer_options WHERE question_id = $qId AND is_correct=TRUE;',
    {
      qId: qId,
    }
  );
  return res;
};

const submitAnswerForQuestion = async (uId, qId, oId) => {
  // updating the table
  await executeQuery(
    'INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES ($uId, $qId, $answer);',
    {
      uId: uId,
      qId: qId,
      answer: oId,
    }
  );

  const res = await getCorrectOption(oId);

  return res.rows[0].is_correct;
};

const listAllQuestions = async () => {
  const res = await executeQuery('SELECT * FROM questions;');

  return res.rows;
};

export {
  listTopics,
  listQuestionsForTopic,
  submitAnswerForQuestion,
  getCorrectOption,
  listAllQuestions,
  getCorrectOptionByQuestion,
};
