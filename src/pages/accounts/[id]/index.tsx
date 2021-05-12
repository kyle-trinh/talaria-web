import { Box, Grid, HStack, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { useQuery } from 'react-query';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import { BASE_URL } from '../../../constants';
import { client } from '../../../utils/api-client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { I_Item } from '../../../types';
import { checkAuth } from '../../../utils/checkAuth';
import { withSession } from '../../../lib/withSession';
import { LoadingLayout } from '../../../components/LoadingLayout';
import { dataToStr } from '../../../utils/transformData';
import { Tag } from '@chakra-ui/tag';
import { AiTwotoneAccountBook } from 'react-icons/ai';
import NextLink from 'next/link';

export default function AccountDetail({ id }: { id: string }) {
  const { status, data, error } = useQuery(['account', id], () =>
    client(`${BASE_URL}/accounts/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
  );

  const {
    data: transactionData,
    status: transactionStatus,
    error: transactionError,
  } = useQuery(['transactions', id], () =>
    client(`${BASE_URL}/transactions/account/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
  );
  const accountDetail = status === 'success' && data.data.data;
  const transactions =
    transactionStatus === 'success' && transactionData.data.data;
  return (
    <>
      <Header title='Accounts details' />
      <ContentHeader title='Accounts details' />
      <Box
        gridArea='main'
        bg='white'
        borderBottomLeftRadius='2xl'
        borderBottomRightRadius='xl'
        display='flex'
        justifyContent='flex-start'
        padding='10px 40px'
        flexDirection='column'
        overflow='auto'
      >
        <Box mt={8} w='100%'>
          {status === 'loading' ? (
            <LoadingLayout noOfLines={10} />
          ) : status === 'error' ? (
            <Alert>
              <AlertIcon />
              <AlertTitle>{(error as Error).message}</AlertTitle>
            </Alert>
          ) : (
            status === 'success' && (
              <Box w='80%'>
                <Grid gridTemplateColumns='repeat(2, 1fr)' gridRowGap='16px'>
                  <Box>
                    <Title>Created At</Title>
                    <TextDetail>{accountDetail.createdAt}</TextDetail>
                  </Box>
                  <Box>
                    <Title>Name</Title>
                    <TextDetail>{accountDetail.name}</TextDetail>
                  </Box>
                  <Box>
                    <Title>Website</Title>
                    <TextDetail>{accountDetail.website}</TextDetail>
                  </Box>
                  <Box>
                    <Title>Balance</Title>
                    <TextDetail>{accountDetail.balance}</TextDetail>
                  </Box>
                  <Box>
                    <Title>Status</Title>
                    <TextDetail>{accountDetail.status}</TextDetail>
                  </Box>
                </Grid>
              </Box>
            )
          )}
          <Box mt='16px'>
            <Text fontSize='24px' fontWeight='bold' color='gray.600'>
              Transactions
            </Text>
            {transactionStatus === 'loading' ? (
              <LoadingLayout noOfLines={10} />
            ) : transactionStatus === 'error' ? (
              <Alert>
                <AlertIcon />
                <AlertTitle>{(transactionError as Error).message}</AlertTitle>
              </Alert>
            ) : (
              transactionStatus === 'success' && (
                <>
                  {transactions.length === 0 && (
                    <Text>No transactions for this account yet!</Text>
                  )}
                  <Table>
                    <Thead>
                      <Tr color='var(--chakra-colors-gray-900)'>
                        <Th>Created At</Th>
                        <Th>Amount </Th>
                        <Th>Associated Account</Th>
                        <Th>Balance</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {transactions.map((transaction: any) => (
                        <Tr>
                          <Td>{dataToStr(transaction.createdAt, 'date')}</Td>
                          <Td>
                            <Tag
                              colorScheme={
                                id === transaction.fromAcct?._id
                                  ? 'red'
                                  : id === transaction.toAcct?._id
                                  ? 'green'
                                  : 'gray'
                              }
                            >
                              {id === transaction.fromAcct?._id
                                ? dataToStr(
                                    transaction.amountSent.value,
                                    transaction.amountSent.currency
                                  )
                                : id === transaction.toAcct?._id
                                ? dataToStr(
                                    transaction.amountRcved.value,
                                    transaction.amountRcved.currency
                                  )
                                : '-'}
                            </Tag>
                          </Td>
                          <Td>
                            {id === transaction.fromAcct?._id &&
                            transaction.toAcct?._id ? (
                              <NextLink
                                href={`/accounts/${transaction.toAcct?._id}`}
                              >
                                <a>
                                  {transaction.toAcct.name}-
                                  {transaction.toAcct.currency}
                                </a>
                              </NextLink>
                            ) : id === transaction.toAcct?._id &&
                              transaction.fromAcct?._id ? (
                              <NextLink
                                href={`/accounts/${transaction.fromAcct?._id}`}
                              >
                                <a>
                                  {transaction.fromAcct.name}-
                                  {transaction.toAcct.currency}
                                </a>
                              </NextLink>
                            ) : (
                              '-'
                            )}
                          </Td>
                          <Td>
                            {id === transaction.fromAcct?._id &&
                            transaction.toAcct?._id ? (
                              <Text>
                                {dataToStr(
                                  transaction.fromBal,
                                  accountDetail.currency
                                )}
                              </Text>
                            ) : id === transaction.toAcct?._id &&
                              transaction.fromAcct?._id ? (
                              <Text>
                                {dataToStr(
                                  transaction.toBal,
                                  accountDetail.currency
                                )}
                              </Text>
                            ) : (
                              '-'
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </>
              )
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Title({ children }: { children: any }) {
  return (
    <Text
      fontSize='20px'
      color='gray.500'
      textTransform='capitalize'
      fontWeight='bold'
    >
      {children}
    </Text>
  );
}

function TextDetail({ children }: { children: any }) {
  return (
    <Text fontSize='16px' color='gray.600'>
      {children}
    </Text>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req, params }: GetServerSidePropsContext) {
    return checkAuth(req, { id: params!.id });
  }
);
