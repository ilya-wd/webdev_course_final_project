import * as topicService from '../../services/topicService.js';
import { validasaur } from '../../utils/deps.js';
import * as validationRules from '../../utils/validationRules.js';
import { executeQuery } from '../../database/database.js';

const listTopics = async ({ render, user }) => {
  let admin = false;

  // if (user && user.email == "admin@admin.com") {
  //   admin = true;
  // }
  if (user && user.admin == true) {
    admin = true;
  }

  render('topics.eta', {
    topics: await topicService.listTopics(),
    adminContent: admin,
  });
};

const getTopicData = async (request, user) => {
  const body = request.body({ type: 'form' });
  const params = await body.value;
  return {
    name: params.get('name'),
    user_id: user.id,
  };
};

const createTopic = async ({ request, response, user, render }) => {
  const topicData = await getTopicData(request, user);

  const [passes, errors] = await validasaur.validate(
    topicData,
    validationRules.topic
  );

  if (!passes) {
    console.log(errors);
    topicData.validationErrors = errors;
    render('topics.eta', topicData);
  } else {
    await topicService.createTopic(topicData.name, topicData.user_id);

    response.redirect('/topics');
  }
};

const deleteTopic = async ({ response, params, user }) => {
  const res1 = await executeQuery('SELECT * FROM topics');

  if (user.admin != true) {
    response.redirect('/topics');
  } else {
    await topicService.deleteTopic(params.id);

    const res2 = await executeQuery('SELECT * FROM topics');

    response.redirect('/topics');
  }
};

const showSingleTopic = async ({ response, request, params, render }) => {
  // const body = request.body();
  const resTopic = await topicService.showSingleTopic(params.id);

  const resQuestions = await topicService.listQuestionsForTopic(params.id);

  render('singleTopic.eta', {
    topic: resTopic,
    questions: resQuestions,
  });
};

export { listTopics, createTopic, deleteTopic, showSingleTopic };
