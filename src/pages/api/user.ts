import { client } from '../../utils/api-client';
import { withSession } from '../me';

export default withSession(async (req: any, res: any) => {
  console.log(req);
  const user = client('localhost:4444/api/v1/users/me', {
    credentials: 'include',
  });
  console.log(user);

  console.log('CALLED HERE');
  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
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
