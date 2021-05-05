import {
  Box,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
} from '@chakra-ui/react';
import React from 'react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import NextLink from 'next/link';
import { client } from '../utils/api-client';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BASE_URL } from '../constants';
import items from '../pages/items';
import { useRouter } from 'next/router';

interface Props {
  title: string;
  user: any;
  isLoading: boolean;
}

export default function ContentHeader({ title, isLoading, user }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    mutate,
    isLoading: isLogoutLoading,
    isError,
    error,
    isSuccess,
    reset,
  } = useMutation(
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
        {!isLoading && user && (
          <Menu>
            <MenuButton>
              <Image
                objectFit='cover'
                boxSize='70px'
                borderRadius='50%'
                alt={`${user.firstName} ${user?.lastName}`}
                src={`http://localhost:4444/api/v1/users/images/${user.profilePicture}`}
              />
            </MenuButton>
            <MenuList>
              <NextLink href='/me' passHref>
                <MenuItem icon={<HiOutlineViewGrid />}>View Profile</MenuItem>
              </NextLink>
              <MenuItem onClick={() => mutate()} icon={<RiLogoutBoxRLine />}>
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        {/* <Icon as={RiUser5Fill} w={45} h={45} color='gray' /> */}
      </Box>
    </Box>
  );
}
