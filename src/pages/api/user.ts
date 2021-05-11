import { BASE_URL } from '../../constants';
import { client } from '../../utils/api-client';
import { withSession } from '../../lib/withSession';

export default withSession(async (req: any, res: any) => {
  console.log(req);
  const data = await client(`${BASE_URL}/users/me`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${req.session.get('jwt')}`,
    },
  });

  console.log('CALLED HERE');
  if (data) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    const user = data.data.data;
    res.json({
      isLoggedIn: true,
      ...user,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});
