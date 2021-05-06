import { Box, Center, Flex, VStack } from '@chakra-ui/layout';
import { Icon, Link, Tooltip } from '@chakra-ui/react';
import React from 'react';
import Image from 'next/image';
import {
  RiDashboardFill,
  RiBillFill,
  RiPriceTag3Fill,
  RiBankFill,
  RiGift2Fill,
  RiBitCoinFill,
} from 'react-icons/ri';
import { ImUser } from 'react-icons/im';
import { IoGitNetworkSharp } from 'react-icons/io5';
import { FaWarehouse } from 'react-icons/fa';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {}

const items = [
  RiDashboardFill,
  RiBankFill,
  RiPriceTag3Fill,
  RiBillFill,
  RiGift2Fill,
  RiBitCoinFill,
  ImUser,
  IoGitNetworkSharp,
  FaWarehouse,
];

const menuItems = [
  {
    pathname: '',
    name: 'Dashboard',
    icon: RiDashboardFill,
  },
  {
    pathname: 'accounts',
    name: 'Accounts',
    icon: RiBankFill,
  },
  {
    pathname: 'items',
    name: 'Items',
    icon: RiPriceTag3Fill,
  },
  {
    pathname: 'bills',
    name: 'Bills',
    icon: RiBillFill,
  },
  {
    pathname: 'giftcards',
    name: 'Gift cards',
    icon: RiGift2Fill,
  },
  {
    pathname: 'cryptos',
    name: 'Cryptos',
    icon: RiBitCoinFill,
  },
  {
    pathname: 'users',
    name: 'Users',
    icon: ImUser,
  },
  // {
  //   pathname: 'affiliates',
  //   name: 'Affiliates',
  //   icon: IoGitNetworkSharp,
  // },
  {
    pathname: 'warehouses',
    name: 'Warehouses',
    icon: FaWarehouse,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  const router = useRouter();
  return (
    <Flex
      gridArea='sidebar'
      alignItems='center'
      justifyContent='flex-start'
      flexDirection='column'
      padding='3rem 0'
    >
      <NextLink href='/' passHref>
        <Box borderRadius={8} mb='50px' cursor='pointer'>
          <Image src='/images/logo.png' width={80} height={80} />
        </Box>
      </NextLink>
      <VStack spacing={0} w='100%'>
        {menuItems.map((item) => {
          const isSelected = router.pathname.split('/')[1] === item.pathname;

          return (
            <NextLink href={`/${item.pathname}`} passHref key={item.name}>
              <Link
                w='100%'
                borderRight={6}
                borderRightColor={isSelected ? 'teal.600' : 'transparent'}
                borderStyle='solid'
                py={3}
              >
                <Center>
                  <Tooltip placement='left' label={item.name} fontSize='md'>
                    <span>
                      <Icon
                        as={item.icon}
                        color={isSelected ? 'teal.600' : 'gray.400'}
                        w={6}
                        h={6}
                      />
                    </span>
                  </Tooltip>
                </Center>
              </Link>
            </NextLink>
          );
        })}
      </VStack>
    </Flex>
  );
};
