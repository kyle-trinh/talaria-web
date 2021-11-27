import { Box, HStack, VStack } from '@chakra-ui/layout';
import {
  Icon,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Image,
  SkeletonCircle,
  Tag,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import Header from '../components/Header';
import { RiUser5Fill } from 'react-icons/ri';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import NextLink from 'next/link';
import { withSession } from '../lib/withSession';
import { GetServerSideProps } from 'next';
import { checkAuth } from '../utils/checkAuth';
import ContentHeader from '../components/ContentHeader';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { client } from '../utils/api-client';
import { BASE_URL } from '../constants';
import { AiTwotoneBank } from 'react-icons/ai';
import React from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { Tooltip } from '@chakra-ui/core';

const Index = () => {
  const { data, status, error } = useQuery('dashboard', () =>
    client(`${BASE_URL}/manage`, { credentials: 'include' })
  );
  const stats = status === 'success' && data.data;
  return (
    <>
      <Header title='Dashboard' />
      <ContentHeader title='Dashboard' />
      <Box
        gridArea='main'
        bg='white'
        borderBottomLeftRadius='2xl'
        borderBottomRightRadius='xl'
        display='flex'
        justifyContent='flex-start'
        padding='20px 40px'
        flexDirection='column'
      >
        {status === 'loading' ? null : status === 'error' ? (
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>{(error as Error).message}</AlertTitle>
          </Alert>
        ) : (
          status === 'success' && (
            <HStack spacing='16px' alignItems='flex-start'>
              <VStack spacing='16px' alignItems='flex-start'>
                <Box>
                  <HStack spacing='16px'>
                    {stats.accounts.map((account: any) => (
                      <Box
                        key={account._id}
                        bg='gray.100'
                        borderRadius='2xl'
                        p='24px 16px'
                      >
                        <VStack spacing='0'>
                          <Icon
                            as={AiTwotoneBank}
                            w='56px'
                            h='56px'
                            color='gray.400'
                          />
                          <Tag colorScheme='gray' variant='solid'>
                            {account.name.split('_')[0]}
                          </Tag>
                          <Text
                            fontSize='32px'
                            fontWeight='bold'
                            color='teal.600'
                          >
                            {account.balance}
                          </Text>
                        </VStack>
                      </Box>
                    ))}
                  </HStack>
                </Box>
                <Box>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th textTransform='capitalize' w='200px'>
                          Created At
                        </Th>
                        <Th textTransform='capitalize' w='200px'>
                          Items
                        </Th>
                        <Th textTransform='capitalize' w='200px'>
                          Status
                        </Th>
                        <Th textTransform='capitalize' w='200px'>
                          Total bill
                        </Th>
                        <Th textTransform='capitalize' w='150px'>
                          Notes
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stats.bills.map((bill: any) => (
                        <Tr key={bill._id}>
                          <Td>{bill.createdAt}</Td>
                          <Td>
                            <Popover>
                              <PopoverTrigger>
                                <Button size='xs'>Item details</Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Item list</PopoverHeader>
                                <PopoverBody>
                                  <List spacing={3}>
                                    {bill.items.map(
                                      (item: any, index: number) => (
                                        <NextLink
                                          href={`/items/${item._id}`}
                                          passHref
                                          key={index}
                                        >
                                          <Link>
                                            <ListItem>
                                              <ListIcon
                                                as={BiCheckCircle}
                                                color='green.500'
                                              />
                                              {`(${item.name} - ${item.pricePerItem}) x ${item.quantity}`}
                                            </ListItem>
                                          </Link>
                                        </NextLink>
                                      )
                                    )}
                                  </List>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </Td>
                          <Td>
                            <Tag
                              variant='outline'
                              colorScheme={
                                bill.status === 'fully-paid'
                                  ? 'gray'
                                  : bill.status === 'partially-paid'
                                  ? 'yellow'
                                  : bill.status === 'not-paid'
                                  ? 'red'
                                  : 'gray'
                              }
                              textTransform='capitalize'
                            >
                              {bill.status.split('-').join(' ')}
                            </Tag>
                          </Td>
                          <Td>{bill.totalBillUsd}</Td>
                          <Td>{bill.notes || '-'}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  {stats.bills.length === 8 && (
                    <NextLink href='/bills'>
                      <a>
                        <Button color='gray.600' mt='8px'>
                          See more
                        </Button>
                      </a>
                    </NextLink>
                  )}
                </Box>
              </VStack>
            </HStack>
          )
        )}
      </Box>
    </>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req }: any) {
    return checkAuth(req);
  }
);
