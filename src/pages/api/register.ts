import { withSession } from '../../lib/withSession';
import { client } from '../../utils/api-client';
import { BASE_URL } from '../../constants';
import Cookies from 'cookies';

export default withSession(async (req: any, res: any) => {
  const url = `${BASE_URL}/users/signup`;

  try {
    // we check that the user exists on GitHub and store some data in session
    const data = await client(url, {
      method: 'POST',

      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    req.session.set('jwt', data.token);
    await req.session.save();
    const cookies = new Cookies(req, res);
    if (data.token) {
      cookies.set('jwt', data.token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        domain:
          process.env.NODE_ENV === 'production'
            ? '.talaria-order.xyz'
            : undefined,
      });
    }
    res.json(data);
  } catch (error) {
    console.log(error);
    const { response: fetchResponse } = error;
    res
      .status(fetchResponse?.status || 500)
      .json({ status: 'error', message: error.message });
  }
});
