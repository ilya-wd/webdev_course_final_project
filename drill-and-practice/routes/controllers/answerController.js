import * as validationRules from '../../utils/validationRules.js';
import * as answerService from '../../services/answerService.js';
import { validasaur } from '../../utils/deps.js';

const getAnswerData = async (request, params) => {
  const body = request.body({ type: 'form' });
  const bodyParams = await body.value;
  const questionId = params.qId;

  const isCorrect = bodyParams.get('is_correct') ? true : false;
  return {
    option_text: bodyParams.get('option_text'),
    question_id: questionId,
    is_correct: isCorrect,
  };
};

const addAnswerOption = async ({ request, params, response }) => {
  const answerData = await getAnswerData(request, params);

  const [passes, errors] = await validasaur.validate(
    answerData,
    validationRules.answer
  );

  if (!passes) {
    console.log(errors);
    answerData.validationErrors = errors;
    render('question.eta', answerData);
  } else {
    await answerService.addAnswerOption(
      answerData.question_id,
      answerData.option_text,
      answerData.is_correct
    );

    response.redirect(`/topics/${params.id}/questions/${params.qId}`);
  }
};

const deleteAnswerOption = async ({ params, response }) => {
  await answerService.deleteAnswerOption(params.oId);
  await answerService.deleteQuestionAnswers(params.oId);

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

export { addAnswerOption, deleteAnswerOption };
