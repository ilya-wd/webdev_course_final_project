import * as quizService from '../../services/quizService.js';
import * as questionService from '../../services/questionService.js';

const sendQuestionJSON = async ({ response }) => {
  // get a list of questions from listQuestions
  const allQuestions = await quizService.listAllQuestions();

  if (allQuestions && allQuestions.length > 0) {
    // get a random number based on number of questions
    const randomN = Math.floor(Math.random() * allQuestions.length);

    const randomQuestion = allQuestions[randomN];
    const answerOptions = await questionService.listAnswerOptions(
      randomQuestion.id
    );

    const optionsArray = [];

    answerOptions.forEach((option) => {
      optionsArray.push({
        optionId: option.id,
        optionText: option.option_text,
      });
    });

    const data = {
      questionId: randomQuestion.id,
      questionText: randomQuestion.question_text,
      answerOptions: optionsArray,
    };

    response.body = data;
  } else response.body = {};
};

const getAnswerJSON = async ({ request, response }) => {
  const body = request.body({ type: 'json' });
  const document = await body.value;

  const res = await quizService.getCorrectOption(document.optionId);

  if (res && res.rows.length > 0) {
    response.body = { correct: res.rows[0].is_correct };
  } else {
    response.status = 404;
  }
};

export { sendQuestionJSON, getAnswerJSON };
