import * as userService from '../../services/userService.js';
import * as validationRules from '../../utils/validationRules.js';
import { bcrypt, validasaur } from '../../utils/deps.js';

const showRegistrationForm = ({ render }) => {
  render('registration.eta');
};

const getUserData = async (request) => {
  const body = request.body({ type: 'form' });
  const bodyParams = await body.value;
  return {
    email: bodyParams.get('email'),
    password: bodyParams.get('password'),
  };
};

const registerUser = async ({ request, response, render }) => {
  const userData = await getUserData(request);

  const [passes, errors] = await validasaur.validate(
    userData,
    validationRules.user
  );

  if (!passes) {
    console.log(errors);
    userData.validationErrors = errors;
    render('registration.eta', userData);
  } else {
    await userService.addUser(
      userData.email,
      await bcrypt.hash(userData.password)
    );

    response.redirect('/auth/login');
  }
};

export { showRegistrationForm, registerUser };
