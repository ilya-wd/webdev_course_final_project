import { executeQuery } from '../database/database.js';

const createQuestion = async (topicId, userId, questionText) => {
  await executeQuery(
    'INSERT INTO questions (user_id, topic_id, question_text) VALUES ($userId, $topicId, $questionText);',
    {
      userId: userId,
      topicId: topicId,
      questionText: questionText,
    }
  );
};

const findQuestionByTopicAndText = async (topicId, questionText) => {
  const res = await executeQuery(
    'SELECT * FROM questions WHERE question_text = $questionText AND topic_id = $topicId',
    {
      questionText: questionText,
      topicId: topicId,
    }
  );

  return res.rows[0];
};

const showQuestion = async (id) => {
  const res = await executeQuery('SELECT * FROM questions WHERE id = $id', {
    id: id,
  });

  return res.rows[0];
};

const listAnswerOptions = async (id) => {
  const res = await executeQuery(
    'SELECT * FROM question_answer_options WHERE question_id = $id',
    {
      id: id,
    }
  );

  return res.rows;
};

const deleteQuestion = async (id) => {
  await executeQuery('DELETE FROM questions WHERE id = $id', {
    id: id,
  });
};

export {
  createQuestion,
  showQuestion,
  listAnswerOptions,
  deleteQuestion,
  findQuestionByTopicAndText,
};
