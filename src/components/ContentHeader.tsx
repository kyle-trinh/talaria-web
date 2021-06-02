import {
  Box,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SkeletonCircle,
} from '@chakra-ui/react';
import React from 'react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import NextLink from 'next/link';
import { client } from '../utils/api-client';
import { useMutation, useQueryClient } from 'react-query';
import { BASE_URL } from '../constants';
import { useRouter } from 'next/router';
import { useMe } from '../hooks/useMe';

interface Props {
  title: string;
  user?: any;
  isLoading?: boolean;
  status?: string;
}

export default function ContentHeader({ title }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, status: mutateStatus } = useMutation(
    () =>
      client(`${BASE_URL}/users/signout`, {
        method: 'GET',
        credentials: 'include',
      }),
    {
      onSettled: () => {
        queryClient.removeQueries('userProfile');
        router.push('/login');
      },
    }
  );

  const { data, error, status: userStatus } = useMe();
  const user = userStatus === 'success' && data.data.data;
  return (
    <Box
      gridArea='header'
      bg='white'
      borderTopLeftRadius='2xl'
      borderTopRightRadius='xl'
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      padding='0 40px'
    >
      <Box textStyle='title' as='h1'>
        {title}
      </Box>
      <Box>
        {userStatus === 'loading'
          ? null
          : userStatus === 'error'
          ? null
          : userStatus === 'success' && (
              <Menu>
                <MenuButton>
                  {mutateStatus === 'loading' ? (
                    <SkeletonCircle w='50px' h='50px' />
                  ) : (
                    <Image
                      objectFit='cover'
                      boxSize='70px'
                      borderRadius='50%'
                      alt={`${user.firstName} ${user?.lastName}`}
                      src={`${BASE_URL}/users/images/${user.profilePicture}`}
                      fallback={<SkeletonCircle w='50px' h='50px' />}
                    />
                  )}
                </MenuButton>
                <MenuList>
                  <NextLink href='/me' passHref>
                    <MenuItem icon={<HiOutlineViewGrid />}>
                      View Profile
                    </MenuItem>
                  </NextLink>
                  <MenuItem
                    onClick={() => mutate()}
                    icon={<RiLogoutBoxRLine />}
                  >
                    Sign out
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
      </Box>
    </Box>
  );
}
