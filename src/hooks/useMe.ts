import { useQuery } from 'react-query';
import { BASE_URL } from '../constants';
import { client } from '../utils/api-client';

export function useMe() {
  const { data, error, status } = useQuery('userProfile', () =>
    client(`${BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
    })
  );

  return { data, error, status };
}
