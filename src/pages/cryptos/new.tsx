import React from 'react';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';
import ContentBody from '../../components/styles/ContentBody';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Input,
  Select,
} from '@chakra-ui/react';
import { Formik, Form, Field, FieldInputProps } from 'formik';
import { InputField } from '../../components/InputField';
import { client } from '../../utils/api-client';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { BASE_URL } from '../../constants';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../hooks/useMe';
import { removeBlankField } from '../../utils';
import { MoneyType, I_Account, I_User } from '../../types';

interface I_FormData {
  fromAccount: string;
  toAccount: string;
  btcAmount: number;
  withdrawFee: number;
  moneySpent: MoneyType;
  usdVndRate: number;
  btcUsdRate: number;
  buyer: string;
  notes?: string;
}

export default function NewCrypto() {
  const route = useRouter();
  const { user, isLoading: isUserLoading, status: userStatus } = useMe();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: I_FormData) => {
      const submitData = removeBlankField({
        ...data,
      });
      return client(`${BASE_URL}/cryptos`, {
        method: 'POST',
        body: JSON.stringify(submitData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        route.push('/cryptos');
      },
    }
  );

  const { data: users, status: usersStatus, error: usersError } = useQuery(
    ['users', 'admin'],
    () => client(`${BASE_URL}/users?role=admin`, { credentials: 'include' })
  );

  const {
    data: accounts,
    status: accountStatus,
    error: accountError,
  } = useQuery(['accounts'], () =>
    client(`${BASE_URL}/accounts`, { credentials: 'include' })
  );

  return (
    <>
      <Header title='Create a new crypto transaction' />
      <ContentHeader
        title='Create a new crypto transaction'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
      />
      <ContentBody>
        <Box maxW='1080px' width='100%'>
          <Formik
            initialValues={{
              fromAccount: '',
              toAccount: '604fdc268b219f0715099180',
              btcAmount: 0,
              withdrawFee: 0,
              moneySpent: {
                value: 0,
                currency: 'vnd',
              },
              usdVndRate: 24000,
              btcUsdRate: 50000,
              buyer: '',
              notes: '',
            }}
            onSubmit={(values: I_FormData) => {
              mutate(values);
            }}
          >
            {() => (
              <Form>
                {isError && (
                  <Alert status='error' mb='16px'>
                    <AlertIcon />
                    <AlertTitle mr={2}>{(error as Error).message}</AlertTitle>
                  </Alert>
                )}
                {isSuccess && (
                  <Alert status='success'>
                    <AlertIcon />
                    <AlertTitle mr={2}>
                      Crypto transaction created! Redirecting...
                    </AlertTitle>
                  </Alert>
                )}
                <Grid
                  gridTemplateColumns='repeat(2, 1fr)'
                  gridGap='24px'
                  gridColumnGap='72px'
                  mb='24px'
                >
                  <InputField
                    type='number'
                    name='btcAmount'
                    placeholder='BTC Amount'
                    label='BTC Amount'
                    required
                  />
                  <InputField
                    type='number'
                    name='withdrawFee'
                    placeholder='Withdraw fee'
                    label='Withdraw fee'
                    required
                  />
                  <HStack alignItems='flex-end'>
                    <Field name='moneySpent.value'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <FormControl>
                          <FormLabel htmlFor='moneySpent'>
                            Money spent
                          </FormLabel>
                          <Input
                            {...field}
                            id='moneySpent'
                            placeholder='Money spent'
                            type='number'
                            required
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='moneySpent.currency'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <Select
                          {...field}
                          id='moneySpentCurrency'
                          required
                          flexShrink={3}
                        >
                          <option value=''>Select</option>
                          <option value='usd'>USD</option>
                          <option value='vnd'>VND</option>
                          <option value='btc'>BTC</option>
                        </Select>
                      )}
                    </Field>
                  </HStack>
                  <InputField
                    type='number'
                    name='usdVndRate'
                    placeholder='USD / VND'
                    label='USD / VND'
                    required
                  />
                  <InputField
                    type='number'
                    name='btcUsdRate'
                    placeholder='BTC / USD'
                    label='BTC / USD'
                    required
                  />
                  <Field name='fromAccount'>
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <FormControl>
                        <FormLabel htmlFor='fromAccount'>
                          From Account
                        </FormLabel>
                        <Select {...field} id='fromAccount' required>
                          <option value=''>Select one</option>
                          {accountStatus ===
                          'loading' ? null : accountStatus === 'error' ? (
                            <option value='error'>
                              {(accountError as Error).message}
                            </option>
                          ) : (
                            accountStatus === 'success' &&
                            accounts.data.data.map((account: I_Account) => (
                              <option key={account._id} value={account._id}>
                                {account.name} - {account.balance}
                              </option>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='toAccount'>
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <FormControl>
                        <FormLabel htmlFor='toAccount'>To Account</FormLabel>
                        <Select {...field} id='toAccount' required>
                          <option value=''>Select one</option>
                          {accountStatus ===
                          'loading' ? null : accountStatus === 'error' ? (
                            <option value='error'>
                              {(accountError as Error).message}
                            </option>
                          ) : (
                            accountStatus === 'success' &&
                            accounts.data.data
                              .filter(
                                (account: I_Account) =>
                                  account.currency === 'btc'
                              )
                              .map((account: I_Account) => (
                                <option key={account._id} value={account._id}>
                                  {account.name} - {account.balance}
                                </option>
                              ))
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='buyer'>
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <FormControl>
                        <FormLabel htmlFor='buyer'>Buyer</FormLabel>
                        <Select {...field} id='buyer' required>
                          <option value=''>Select one</option>
                          {usersStatus === 'loading' ? null : userStatus ===
                            'error' ? (
                            <option value='error'>
                              {(usersError as Error).message}
                            </option>
                          ) : (
                            usersStatus === 'success' &&
                            users.data.data.map((user: I_User) => (
                              <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                              </option>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <InputField
                    type='text'
                    name='notes'
                    placeholder='Notes'
                    label='Notes'
                    textarea
                  />
                </Grid>
                <Button type='submit' colorScheme='teal' isLoading={isLoading}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </ContentBody>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
}: GetServerSidePropsContext) {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery('userProfile', () =>
      client('http://localhost:4444/api/v1/users/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: req.cookies?.jwt && `Bearer ${req.cookies.jwt}`,
        },
      })
    );

    return {
      props: { dehydratedState: dehydrate(queryClient) },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
