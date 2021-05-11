import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { BASE_URL } from '../constants';
import { client } from './api-client';

export async function checkAuth(req: any, optional?: any) {
  const jwt = req.session.get('jwt');
  if (!jwt) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery('userProfile', () =>
      client(`${BASE_URL}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${req.session.get('jwt')}`,
        },
      })
    );

    return {
      props: { dehydratedState: dehydrate(queryClient), ...optional },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
}
