import * as quizService from '../../services/quizService.js';
import * as questionService from '../../services/questionService.js';

const listTopics = async ({ request, response, user, render }) => {
  const topics = await quizService.listTopics();

  render('quiz.eta', {
    topics: topics,
    // noQuestionsError: false
  });
};

const selectTopic = async ({ request, params, response, render }) => {
  const questionList = await quizService.listQuestionsForTopic(params.tId);

  if (questionList && questionList.length > 0) {
    const randomN = Math.floor(Math.random() * questionList.length);

    const randomId = questionList[randomN].id;
    response.redirect(`/quiz/${params.tId}/questions/${randomId}`);
  } else {
    render('quiz.eta', {
      topics: await quizService.listTopics(),
      noQuestionsError: `There are no questions for topic you selected yet. Please select a different one.`,
    });
  }
};

const showRandomQuestion = async ({ params, request, user, render }) => {
  const randomQuestion = await questionService.showQuestion(params.qId);

  const answerOptions = await questionService.listAnswerOptions(params.qId);

  render('questionQuiz.eta', {
    question: randomQuestion,
    answerOptions: answerOptions,
  });
};

const submitAnswer = async ({ params, request, user, response, render }) => {
  const res = await quizService.submitAnswerForQuestion(
    user.id,
    params.qId,
    params.oId
  );

  if (res) {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
  } else {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
  }
};

const showCorrect = async ({ params, request, response, render }) => {
  render('correctAnswer.eta', {
    topicId: params.tId,
  });
};

const showIncorrect = async ({ params, request, response, render }) => {
  const correctAnswer = await quizService.getCorrectOptionByQuestion(
    params.qId
  );

  render('incorrectAnswer.eta', {
    topicId: params.tId,
    option: correctAnswer.rows[0],
  });
};

export {
  listTopics,
  selectTopic,
  showRandomQuestion,
  submitAnswer,
  showCorrect,
  showIncorrect,
};
