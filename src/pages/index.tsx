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
              <VStack
                spacing='8px'
                alignItems='flex-start'
                justifyContent='flex-start'
              >
                <Text fontSize='32px' fontWeight='bold' color='gray.500'>
                  Commissions
                </Text>
                <Box>
                  <Table>
                    <Tbody>
                      {stats.commissions.map((commission: any) => (
                        <CommissionRow
                          key={commission._id}
                          commission={commission}
                        />
                      ))}
                    </Tbody>
                  </Table>
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

function CommissionRow({ commission }: { commission: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const { mutate, error, status, isLoading } = useMutation(
    (data: { amount: number }) =>
      client(`${BASE_URL}/commissions/${commission._id}/pay`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries('dashboard');
      },
    }
  );
  return (
    <Tr>
      <Td>
        <NextLink href={`/users/${commission.affiliate._id}`}>
          <a>
            <Tooltip
              aria-label='tooltip'
              label={`${commission.affiliate.firstName} ${commission.affiliate.lastName}`}
            >
              <Image
                w='50px'
                h='50px'
                objectFit='cover'
                borderRadius='50%'
                src={`${BASE_URL}/users/images/${commission.affiliate.profilePicture}`}
                fallback={<SkeletonCircle w='50px' h='50px' />}
              />
            </Tooltip>
          </a>
        </NextLink>
      </Td>
      <Td>{commission.createdAt.split(',')[0]}</Td>
      <Td>
        {new Intl.NumberFormat('us-US', {
          style: 'currency',
          currency: 'vnd',
        }).format(parseFloat(commission.amount['$numberDecimal']))}
      </Td>
      <Td>
        <Tag
          variant='outline'
          colorScheme={
            commission.status === 'pending'
              ? 'red'
              : commission.status === 'paid'
              ? 'gray'
              : 'blue'
          }
        >
          {commission.status}
        </Tag>
      </Td>
      <Td>
        <Button
          size='sm'
          colorScheme='teal'
          disabled={commission.status === 'fully-paid'}
          onClick={onOpen}
        >
          Pay
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <Formik
            initialValues={{
              amount: parseFloat(commission.amount['$numberDecimal']),
            }}
            onSubmit={(value) => {
              mutate(value);
            }}
          >
            {() => (
              <Form>
                <ModalContent>
                  <ModalHeader>Enter amount</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <InputField
                      name='amount'
                      placeholder='Amount'
                      label='Amount (Edit if you want to pay more)'
                      type='number'
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme='teal'
                      type='submit'
                      isLoading={isLoading}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Form>
            )}
          </Formik>
        </Modal>
      </Td>
    </Tr>
  );
}
