import { superoak, Client } from '../utils/deps.js';
import { assertEquals } from '../utils/deps.js';
import { app } from '../app.js';
import * as topicService from '../services/topicService.js';
import * as answerService from '../services/answerService.js';
import * as questionService from '../services/questionService.js';
import * as userService from '../services/userService.js';
import * as quizService from '../services/quizService.js';
import * as statisticsService from '../services/statisticsService.js';
import { executeQuery } from '../database/database.js';

// Deno.test("#1 The app works", async () => {
//   const request = await superoak(app);
//   await request.get("/").expect(200);
// });

Deno.test({
  name: '#1 The app works',
  async fn() {
    // const testing = await executeQuery("SELECT * FROM users")
    // console.log(testing.rows)
    const request = await superoak(app);
    await request.get('/').expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#2 Get a JSON object in response to api request works',
  async fn() {
    const testClient = await superoak(app);
    await testClient.get('/api/questions/random').expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#3 A user can be added to a database',
  async fn() {
    await userService.addUser('deno@test.com', 1234);
    const res = await userService.findUserByEmail('deno@test.com');
    await assertEquals(res[0].email, 'deno@test.com');
    await userService.deleteUser(res[0].email);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#4 A question can be added to a database',
  async fn() {
    await userService.addUser('deno1@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno1@test.com');
    await topicService.createTopic('Deno test1', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test1'
    );
    await questionService.createQuestion(
      testTopic.id,
      testUser.id,
      'Deno test1'
    );
    const testQuestion = await questionService.findQuestionByTopicAndText(
      testTopic.id,
      'Deno test1'
    );
    await assertEquals(testQuestion.question_text, 'Deno test1');
    await questionService.deleteQuestion(testQuestion.id);
    await userService.deleteUser(testUser.email);
    await topicService.deleteTopic(testTopic.id);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#5 A topic can be added to a database',
  async fn() {
    await userService.addUser('deno2@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno2@test.com');
    await topicService.createTopic('Deno test2', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test2'
    );
    await assertEquals(testTopic.name, 'Deno test2');
    await topicService.deleteTopic(testTopic.id);
    await userService.deleteUser(testUser.email);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#6 An answer option can be added to a database',
  async fn() {
    await userService.addUser('deno4@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno4@test.com');
    await topicService.createTopic('Deno test4', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test4'
    );
    await questionService.createQuestion(
      testTopic.id,
      testUser.id,
      'Deno test4'
    );
    const testQuestion = await questionService.findQuestionByTopicAndText(
      testTopic.id,
      'Deno test4'
    );
    await answerService.addAnswerOption(testQuestion.id, 'Deno test4', true);
    const testAnswer = await answerService.findAnswerByQuestionTextCorrect(
      testQuestion.id,
      'Deno test4',
      true
    );
    await assertEquals(testAnswer.option_text, 'Deno test4');
    await answerService.deleteAnswerOption(testAnswer.id);
    await topicService.deleteTopic(testTopic.id);
    await userService.deleteUser(testUser.email);
    await questionService.deleteQuestion(testQuestion.id);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#7 Statistics on topics work properly',
  async fn() {
    // const test1 = await topicService.listTopics()
    // console.log(test1)

    const firstRes = await statisticsService.countTopics();
    await userService.addUser('deno5@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno5@test.com');
    await topicService.createTopic('Deno test5', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test5'
    );
    // await topicService.createTopic("Deno test", 1234)

    // const test2 = await topicService.listTopics()
    // console.log(test2)

    const secondRes = await statisticsService.countTopics();
    await assertEquals(Number(firstRes) + 1, Number(secondRes));

    await topicService.deleteTopic(testTopic.id);
    await userService.deleteUser(testUser.email);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#8 Statistics on answers work properly',
  async fn() {
    const test1 = await executeQuery('SELECT * FROM question_answers');

    const firstRes = await statisticsService.countAnswers();

    await userService.addUser('deno8@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno8@test.com');
    await topicService.createTopic('Deno test8', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test8'
    );
    await questionService.createQuestion(
      testTopic.id,
      testUser.id,
      'Deno test8'
    );
    const testQuestion = await questionService.findQuestionByTopicAndText(
      testTopic.id,
      'Deno test8'
    );
    await answerService.addAnswerOption(testQuestion.id, 'Deno test8', true);
    const testAnswer = await answerService.findAnswerByQuestionTextCorrect(
      testQuestion.id,
      'Deno test8',
      true
    );

    await quizService.submitAnswerForQuestion(
      testUser.id,
      testQuestion.id,
      testAnswer.id
    );

    const test2 = await executeQuery('SELECT * FROM question_answers');
    const secondRes = await statisticsService.countAnswers();
    await assertEquals(Number(firstRes) + 1, Number(secondRes));

    await answerService.deleteQuestionAnswers(testAnswer.id);
    await answerService.deleteAnswerOption(testAnswer.id);
    await questionService.deleteQuestion(testQuestion.id);
    await topicService.deleteTopic(testTopic.id);
    await userService.deleteUser(testUser.email);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#9 Statistics on questions work properly',
  async fn() {
    // const test1 = await executeQuery('SELECT * FROM questions');

    const firstRes = await statisticsService.countQuestions();

    await userService.addUser('deno9@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno9@test.com');
    await topicService.createTopic('Deno test9', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test9'
    );
    await questionService.createQuestion(
      testTopic.id,
      testUser.id,
      'Deno test9'
    );
    const testQuestion = await questionService.findQuestionByTopicAndText(
      testTopic.id,
      'Deno test9'
    );

    // const test2 = await executeQuery('SELECT * FROM questions');

    const secondRes = await statisticsService.countQuestions();
    await assertEquals(Number(firstRes) + 1, Number(secondRes));

    await questionService.deleteQuestion(testQuestion.id);
    await topicService.deleteTopic(testTopic.id);
    await userService.deleteUser(testUser.email);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: '#10 An answer option can be checked for correctness',
  async fn() {
    await userService.addUser('deno10@test.com', 1234);
    const testUser = await userService.findUserByEmail('deno10@test.com');
    await topicService.createTopic('Deno test10', testUser[0].id);
    const testTopic = await topicService.findTopicByUserAndName(
      testUser[0].id,
      'Deno test10'
    );
    await questionService.createQuestion(
      testTopic.id,
      testUser.id,
      'Deno test10'
    );
    const testQuestion = await questionService.findQuestionByTopicAndText(
      testTopic.id,
      'Deno test10'
    );
    await answerService.addAnswerOption(testQuestion.id, 'Deno test10', true);
    const testAnswer = await answerService.findAnswerByQuestionTextCorrect(
      testQuestion.id,
      'Deno test10',
      true
    );

    let check = await quizService.getCorrectOption(testAnswer.id);
    check = check.rows[0];

    await assertEquals(testAnswer.is_correct, check.is_correct);
    assertEquals(testAnswer.is_correct, true);
    assertEquals(testAnswer.is_correct, true);

    await answerService.deleteAnswerOption(testAnswer.id);
    await topicService.deleteTopic(testTopic.id);
    await userService.deleteUser(testUser.email);
    await questionService.deleteQuestion(testQuestion.id);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

// Deno.test("database #1-7??: creating users", async (t) => {
//   const client = new Client({
//     user: "username",
//     // database: "database",
//     database: "database-p2-c41133f9-c2c3-427b-a316-9d46763241fd",
//     hostname: "localhost",
//     port: 5432,
//   });
//   await client.connect();

//   // provide a step name and function
//   await t.step("insert user", async () => {
//     const users = await client.queryObject<User>(
//       "INSERT INTO users (name) VALUES ('Deno') RETURNING *",
//     );
//     assertEquals(users.rows.length, 1);
//     assertEquals(users.rows[0].name, "Deno");
//   });

//   // or provide a test definition
//   await t.step({
//     name: "insert book",
//     fn: async () => {
//       const books = await client.queryObject<Book>(
//         "INSERT INTO books (name) VALUES ('The Deno Manual') RETURNING *",
//       );
//       assertEquals(books.rows.length, 1);
//       assertEquals(books.rows[0].title, "The Deno Manual");
//     },
//     ignore: false,
//     // these default to the parent test or step's value
//     sanitizeOps: true,
//     sanitizeResources: true,
//     sanitizeExit: true,
//   });

//   // nested steps are also supported
//   await t.step("update and delete", async (t) => {
//     await t.step("update", () => {
//       // even though this test throws, the outer promise does not reject
//       // and the next test step will run
//       throw new Error("Fail.");
//     });

//     await t.step("delete", () => {
//       // ...etc...
//     });
//   });

//   // // steps return a value saying if they ran or not
//   // const testRan = await t.step({
//   //   name: "copy books",
//   //   fn: () => {
//   //     // ...etc...
//   //   },
//   //   ignore: true, // was ignored, so will return `false`
//   // });

//   // // steps can be run concurrently if sanitizers are disabled on sibling steps
//   // const testCases = [1, 2, 3];
//   // await Promise.all(testCases.map((testCase) =>
//   //   t.step({
//   //     name: `case ${testCase}`,
//   //     fn: async () => {
//   //       // ...etc...
//   //     },
//   //     sanitizeOps: false,
//   //     sanitizeResources: false,
//   //     sanitizeExit: false,
//   //   })
//   // ));

//   client.end();
// });
