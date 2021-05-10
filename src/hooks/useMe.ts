import { useQuery } from 'react-query';
import { client } from '../utils/api-client';

export function useMe() {
  const { data, isLoading, status } = useQuery('userProfile', () =>
    client('/api/me', {
      method: 'GET',
      credentials: 'include',
    })
  );
  // console.log(response.data);

  return { user: data, isLoading: isLoading, status: status };
}
