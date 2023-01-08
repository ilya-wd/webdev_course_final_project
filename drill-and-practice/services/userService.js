import { executeQuery } from '../database/database.js';

// await executeQuery(
//   `INSERT INTO users (email, password) VALUES ($email, $password)`,
//   { email: email, password: password }
// );

const findUserByEmail = async (email) => {
  const res = await executeQuery(`SELECT * FROM users WHERE email = $email;`, {
    email: email,
  });

  return res.rows;
};

const addUser = async (email, password) => {
  await executeQuery(
    `INSERT INTO users (email, password) VALUES ($email, $password)`,
    { email: email, password: password }
  );
};

const deleteUser = async (email) => {
  await executeQuery('DELETE FROM users WHERE email = $email', {
    email: email,
  });
};

export { addUser, findUserByEmail, deleteUser };
