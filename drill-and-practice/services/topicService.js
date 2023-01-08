import { executeQuery } from "../database/database.js"

const listTopics = async () => {
  const res = await executeQuery(`SELECT * FROM topics
   ORDER BY name ASC;
`);

return res.rows;
}

const createTopic = async (name, userId) => {
  await executeQuery('INSERT INTO topics (name, user_id) VALUES ($name, $userId);', {
    name: name,
    userId: userId
  })
}

const findTopicByUserAndName = async(userId, name) => {
  const res = await executeQuery("SELECT * FROM topics WHERE user_id = $userId AND name = $name", {
    userId: userId,
    name: name
  })

  return res.rows[0]
}

const deleteTopic = async (id) => {
  
  const questions = await executeQuery("SELECT * FROM questions WHERE topic_id = $id", {
    id: id
  })
  
  questions.rows.forEach(async (question) => {
    await executeQuery("DELETE FROM question_answer_options WHERE question_id = $qId;", {
      qId: question.id
    })
    
    await executeQuery("DELETE FROM question_answers WHERE question_id = $qId;", {
      qId: question.id
    })
  })
  
  await executeQuery("DELETE FROM questions WHERE topic_id = $id;", {
    id: id
  })
  await executeQuery('DELETE FROM topics WHERE id = $id', {
    id: id
  })
};

const showSingleTopic = async (id) => {
  const res = await executeQuery('SELECT * FROM topics WHERE id = $id', {
    id: +id,
  })

  return res.rows[0];
}

const listQuestionsForTopic = async(id) => {
  const res = await executeQuery('SELECT * FROM questions WHERE topic_id = $id', {
    id: id
  });

  return res.rows;
}

export {listTopics, createTopic, showSingleTopic, listQuestionsForTopic, deleteTopic, findTopicByUserAndName};