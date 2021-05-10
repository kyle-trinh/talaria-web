import { withSession } from '../src/pages/me';
import { client } from '../src/utils/api-client';
import { BASE_URL } from '../src/constants';

export default withSession(async (req: any, res: any) => {
  const { email, password } = await req.body;
  const url = `${BASE_URL}/users/signin`;

  try {
    // we check that the user exists on GitHub and store some data in session
    const {
      data: { user },
    } = await client(url, {
      method: 'POST',

      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    // console.log(login);
    // console.log(avatarUrl);
    const newUser = { isLoggedIn: true, ...user };
    req.session.set('user', newUser);
    console.log(user);
    console.log('GET USER ', req.session.get('user'));
    // await req.session.save();
    console.log('here');
    res.json(newUser);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});

// export async function fetcher(...args: any[]) {
//   try {
//     const response = await fetch(...args);

//     // if the server replies, there's always some data in json
//     // if there's a network error, it will throw at the previous line
//     const data = await response.json();

//     if (response.ok) {
//       return data;
//     }

//     const error = new Error(response.statusText);
//     error.response = response;
//     error.data = data;
//     throw error;
//   } catch (error) {
//     if (!error.data) {
//       error.data = { message: error.message };
//     }
//     throw error;
//   }
// }
