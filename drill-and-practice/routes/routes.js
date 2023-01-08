import { Router } from '../utils/deps.js';
import * as mainController from './controllers/mainController.js';
import * as topicController from './controllers/topicController.js';
import * as questionController from './controllers/questionController.js';
import * as answerController from './controllers/answerController.js';
import * as userController from './controllers/userController.js';
import * as loginController from './controllers/loginController.js';
import * as quizController from './controllers/quizController.js';
import * as quizApi from './apis/quizApi.js';

const router = new Router();

router.get('/', mainController.showMain);

router.get('/topics', topicController.listTopics);
router.post('/topics', topicController.createTopic);

router.get('/topics/:id', topicController.showSingleTopic);
router.post('/topics/:id/questions', questionController.createQuestion);
router.post('/topics/:id/delete', topicController.deleteTopic);

router.get('/topics/:id/questions/:qId', questionController.showQuestion);
router.post(
  '/topics/:id/questions/:qId/options',
  answerController.addAnswerOption
);

router.post(
  '/topics/:tId/questions/:qId/options/:oId/delete',
  answerController.deleteAnswerOption
);

router.post(
  '/topics/:tId/questions/:qId/delete',
  questionController.deleteQuestion
);

router.get('/auth/register', userController.showRegistrationForm);
router.post('/auth/register', userController.registerUser);

router.get('/auth/login', loginController.showLoginForm);
router.post('/auth/login', loginController.processLogin);

router.get('/quiz', quizController.listTopics);
router.get('/quiz/:tId', quizController.selectTopic);
router.get('/quiz/:tId/questions/:qId', quizController.showRandomQuestion);

router.post(
  '/quiz/:tId/questions/:qId/options/:oId',
  quizController.submitAnswer
);

router.get('/quiz/:tId/questions/:qId/correct', quizController.showCorrect);
router.get('/quiz/:tId/questions/:qId/incorrect', quizController.showIncorrect);

router.get('/api/questions/random', quizApi.sendQuestionJSON);
router.post('/api/questions/answer', quizApi.getAnswerJSON);

export { router };
