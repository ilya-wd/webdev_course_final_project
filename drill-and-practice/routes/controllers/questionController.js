import * as questionService from '../../services/questionService.js';
import * as validationRules from '../../utils/validationRules.js';
import { validasaur } from '../../utils/deps.js';

const getQuestionData = async (request, user, params) => {
  const body = request.body({ type: 'form' });
  const bodyParams = await body.value;
  const topicId = params.id;
  return {
    question_text: bodyParams.get('question_text'),
    user_id: user.id,
    topic_id: topicId,
  };
};

const createQuestion = async ({ request, response, params, user, render }) => {
  const questionData = await getQuestionData(request, user, params);

  const [passes, errors] = await validasaur.validate(
    questionData,
    validationRules.question
  );

  if (!passes) {
    console.log(errors);
    questionData.validationErrors = errors;
    render('singleTopic.eta', questionData);
  } else {
    await questionService.createQuestion(
      questionData.topic_id,
      questionData.user_id,
      questionData.question_text
    );

    response.redirect(`/topics/${questionData.topic_id}`);
  }
};

const showQuestion = async ({ params, render }) => {
  const question = await questionService.showQuestion(params.qId);

  const answerOptions = await questionService.listAnswerOptions(params.qId);

  render('question.eta', {
    question: question,
    answerOptions: answerOptions,
  });
};

const deleteQuestion = async ({ params, response }) => {
  await questionService.deleteQuestion(params.qId);

  response.redirect(`/topics/${params.tId}`);
};

export { createQuestion, showQuestion, deleteQuestion };
