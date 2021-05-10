import { useQuery } from 'react-query';
import { client } from '../utils/api-client';

export function useMe() {
  const response = useQuery('userProfile', () =>
    client('/api/me', {
      method: 'GET',
      credentials: 'include',
    })
  );
  console.log(response.data);

  return {};
}
