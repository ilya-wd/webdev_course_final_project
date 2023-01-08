import { validasaur } from "./deps.js";

const topic = {
  name: [validasaur.required, validasaur.minLength(1)],
  // user_id ??
}

const question = {
  question_text: [validasaur.required, validasaur.minLength(1)]
}

const answer = {
  option_text: [validasaur.required, validasaur.minLength(1)]
}

const user = {
  email: [ validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)]
}

export { topic, question, answer, user }