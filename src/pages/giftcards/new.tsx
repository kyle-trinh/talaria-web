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
import { checkAuth } from '../../utils/checkAuth';
import { withSession } from '../../lib/withSession';

interface I_FormData {
  price: MoneyType;
  fee: MoneyType;
  value: number;
  website: string;
  btcUsdRate: number;
  usdVndRate: number;
  fromAccount: string;
  toAccount: string;
  notes?: string;
}

export default function NewCrypto() {
  const route = useRouter();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: I_FormData) => {
      const submitData = removeBlankField({
        ...data,
      });
      return client(`${BASE_URL}/giftcards`, {
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
        route.push('/giftcards');
      },
    }
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
      <ContentHeader title='Create a new crypto transaction' />
      <ContentBody>
        <Box maxW='1080px' width='100%'>
          <Formik
            initialValues={{
              price: {
                value: 0,
                currency: '',
              },
              fee: {
                value: 0,
                currency: '',
              },
              value: 0,
              website: '',
              btcUsdRate: 50000,
              usdVndRate: 24000,
              fromAccount: '604fdc268b219f0715099180',
              toAccount: '',
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
                      Giftcard transaction created! Redirecting...
                    </AlertTitle>
                  </Alert>
                )}
                <Grid
                  gridTemplateColumns='repeat(2, 1fr)'
                  gridGap='24px'
                  gridColumnGap='72px'
                  mb='24px'
                >
                  <HStack alignItems='flex-end'>
                    <Field name='price.value'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <FormControl>
                          <FormLabel htmlFor='price'>Price</FormLabel>
                          <Input
                            {...field}
                            id='price'
                            placeholder='Price'
                            type='number'
                            required
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='price.currency'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <Select
                          {...field}
                          id='priceCurrency'
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
                  <HStack alignItems='flex-end'>
                    <Field name='fee.value'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <FormControl>
                          <FormLabel htmlFor='fee'>Fee</FormLabel>
                          <Input
                            {...field}
                            id='fee'
                            placeholder='Fee'
                            type='number'
                            required
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name='fee.currency'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <Select
                          {...field}
                          id='feeCurrency'
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
                    name='value'
                    placeholder='Gift card valu'
                    label='Gift card value'
                    required
                  />
                  <Field name='website'>
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <FormControl>
                        <FormLabel htmlFor='website'>Website</FormLabel>
                        <Select {...field} id='website' required>
                          <option value=''>Select one</option>
                          <option value='amazon'>Amazon</option>
                          <option value='sephora'>Sephora</option>
                          <option value='bestbuy'>Bestbuy</option>
                          <option value='costco'>Costco</option>
                          <option value='target'>Target</option>
                          <option value='walmart'>Walmart</option>
                          <option value='others'>Others</option>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <InputField
                    type='number'
                    name='btcUsdRate'
                    placeholder='BTC / USD'
                    label='BTC / USD'
                    required
                  />
                  <InputField
                    type='number'
                    name='usdVndRate'
                    placeholder='USD / VND'
                    label='USD / VND'
                    required
                  />
                  <Field name='fromAccount'>
                    {({ field }: { field: FieldInputProps<any> }) => (
                      <FormControl>
                        <FormLabel htmlFor='fromAcct'>From Account</FormLabel>
                        <Select {...field} id='fromAcct' required>
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
                                  account.currency === 'usd'
                              )
                              .map((account: I_Account) => (
                                <option key={account._id} value={account._id}>
                                  {account.name} - {account.website} -{' '}
                                  {account.balance}
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

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req, res }: GetServerSidePropsContext) {
    return checkAuth(req);
  }
);
