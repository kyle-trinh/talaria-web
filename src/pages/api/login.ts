import { withSession } from '../../lib/withSession';
import { client } from '../../utils/api-client';
import { BASE_URL } from '../../constants';
import Cookies from 'cookies';

export default withSession(async (req: any, res: any) => {
  const { email, password } = await req.body;
  const url = `${BASE_URL}/users/signin`;

  try {
    // we check that the user exists on GitHub and store some data in session
    const data = await client(url, {
      method: 'POST',

      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    // const { login } = await client(
    //   'https://api.github.com/users/binhthaitrinh'
    // );
    // console.log(login);
    // console.log(avatarUrl);
    // const newuser = { isloggedin: true, ...user };
    // req.session.set('user', newUser);
    // console.log(user);
    // console.log('GET USER ', req.session.get('user'));
    // await req.session.save();
    // console.log('here');
    // req.session.set('user', newUser);
    req.session.set('jwt', data.token);
    // req.session.set('user', data.data.user);
    await req.session.save();
    const cookies = new Cookies(req, res);
    if (data.token) {
      cookies.set('jwt', data.token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        // // only send cookie on https
        // // secure: process.env.NODE_ENV === 'production' ? true : false,
        // secure: true,
        httpOnly: false,
        domain: 'https://polar-river-10904.herokuapp.com/',
      });
    }
    res.json(data);
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
