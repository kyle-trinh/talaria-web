import React from 'react';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import ContentBody from '../../../components/styles/ContentBody';
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
  Select,
} from '@chakra-ui/react';
import { Formik, Form, Field, FieldInputProps } from 'formik';
import { InputField } from '../../../components/InputField';
import { client } from '../../../utils/api-client';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { BASE_URL } from '../../../constants';
import { Router, useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../../hooks/useMe';
import { removeBlankField } from '../../../utils';

interface I_FormData {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  notes?: string;
  deliveredTo: string;
}

export default function NewCrypto({ id }) {
  const route = useRouter();
  const { user, isLoading: isUserLoading, status: userStatus } = useMe();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: I_FormData) => {
      const submitData = removeBlankField({
        ...data,
      });
      return client(`${BASE_URL}/warehouses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(submitData),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    },
    {
      onSuccess: () => {
        route.push('/warehouses');
      },
    }
  );

  const {
    data: warehouseData,
    status: warehouseStatus,
    error: warehouseError,
  } = useQuery(['warehouse', id], () =>
    client(`${BASE_URL}/warehouses/${id}`, { credentials: 'include' })
  );

  const warehouse = warehouseStatus === 'success' && warehouseData.data.data;

  return (
    <>
      <Header title='Edit warehouse' />
      <ContentHeader
        title='Edit warehouse'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
      />
      <ContentBody>
        {warehouseStatus === 'loading' ? null : warehouseStatus === 'error' ? (
          <Alert>
            <AlertIcon />
            <AlertTitle>{(warehouseError as Error).message}</AlertTitle>
          </Alert>
        ) : (
          warehouseStatus === 'success' && (
            <Box maxW='1080px' width='100%'>
              <Formik
                initialValues={{
                  name: warehouse.name,
                  address1: warehouse.address1,
                  address2: warehouse.address2 || '',
                  city: warehouse.city,
                  state: warehouse.state,
                  zipcode: warehouse.zipcode,
                  phone: warehouse.phone || '',
                  notes: warehouse.notes || '',
                  deliveredTo: warehouse.deliveredTo,
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
                        <AlertTitle mr={2}>
                          {(error as Error).message}
                        </AlertTitle>
                      </Alert>
                    )}
                    {isSuccess && (
                      <Alert status='success'>
                        <AlertIcon />
                        <AlertTitle mr={2}>
                          New warehouse created! Redirecting...
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
                        type='text'
                        name='name'
                        placeholder='Name'
                        label='Name'
                        required
                      />
                      <InputField
                        type='text'
                        name='address1'
                        placeholder='Street Address'
                        label='Street Address'
                        required
                      />
                      <InputField
                        type='text'
                        name='address2'
                        placeholder='Apt/Suite No'
                        label='Apt/Suite No'
                      />
                      <InputField
                        type='text'
                        name='city'
                        placeholder='City'
                        label='City'
                        required
                      />
                      <InputField
                        type='text'
                        name='state'
                        placeholder='State'
                        label='State'
                        required
                      />
                      <InputField
                        type='text'
                        name='zipcode'
                        placeholder='Zip code'
                        label='Zip code'
                        required
                      />
                      <InputField
                        type='text'
                        name='phone'
                        placeholder='Phone'
                        label='Phone'
                      />
                      <Field name='deliveredTo'>
                        {({ field }: { field: FieldInputProps<any> }) => (
                          <FormControl>
                            <FormLabel htmlFor='delivetedTo'>
                              Deliver to
                            </FormLabel>
                            <Select {...field} id='deliveredTo'>
                              <option value=''>Select</option>
                              <option value='ha noi'>TP. Hanoi</option>
                              <option value='ho chi minh'>TP. HCM</option>
                            </Select>
                          </FormControl>
                        )}
                      </Field>
                      <InputField
                        type='text'
                        name='notes'
                        placeholder='Notes'
                        label='Notes'
                      />
                    </Grid>
                    <HStack spacing='8px'>
                      <Button onClick={() => route.back()}>Go back</Button>
                      <Button
                        type='submit'
                        colorScheme='teal'
                        isLoading={isLoading}
                      >
                        Submit
                      </Button>
                    </HStack>
                  </Form>
                )}
              </Formik>
            </Box>
          )
        )}
      </ContentBody>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
  params,
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
      props: { dehydratedState: dehydrate(queryClient), id: params.id },
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
