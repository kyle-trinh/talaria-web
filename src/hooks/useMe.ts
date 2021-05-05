import { useQuery } from 'react-query';
import { client } from '../utils/api-client';

export function useMe() {
  const {
    data: {
      data: { data: user },
    },
    isLoading,
    status,
  } = useQuery('userProfile', () =>
    client('http://localhost:4444/api/v1/users/me', {
      method: 'GET',
      credentials: 'include',
    })
  );

  return { user, isLoading, status };
}
