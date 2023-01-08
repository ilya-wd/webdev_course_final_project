import * as userService from '../../services/userService.js';
// import * as validationRules from "../../utils/validationRules.js"
import { bcrypt } from '../../utils/deps.js';

const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: 'form' });
  const params = await body.value;

  const userFromDatabase = await userService.findUserByEmail(
    params.get('email')
  );
  if (userFromDatabase.length != 1) {
    render('login.eta', {
      loginError: 'No user associated with that email found.',
    });
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get('password'),
    user.password
  );

  if (!passwordMatches) {
    render('login.eta', {
      loginError: "Passwords don't match.",
    });
  }

  await state.session.set('user', user);
  response.redirect('/topics');
};

const showLoginForm = ({ render }) => {
  render('login.eta');
};

export { processLogin, showLoginForm };
