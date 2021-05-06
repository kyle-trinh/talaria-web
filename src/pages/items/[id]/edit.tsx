import { Box, Grid } from '@chakra-ui/layout';
import React from 'react';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import ContentBody from '../../../components/styles/ContentBody';
import { client } from '../../../utils/api-client';
import { useRouter } from 'next/router';
import { BASE_URL } from '../../../constants';
import { Form, Formik } from 'formik';
import { InputField } from '../../../components/InputField';
import { Button } from '@chakra-ui/button';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../../hooks/useMe';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { removeBlankField } from '../../../utils';
import { I_Item } from '../../../types';

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query;
  const queryClient = useQueryClient();
  const { user, isLoading: isUserLoading, status: userStatus } = useMe();
  const { status, data, error } = useQuery(['item', id], () =>
    client(`${BASE_URL}/items/${id}`)
  );

  const { mutate, error: mutateError, isError, isLoading } = useMutation(
    (data: I_Item) =>
      client(`${BASE_URL}/items/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(removeBlankField(data)),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: () => {
        router.push('/items');
        queryClient.invalidateQueries(['item', id]);
      },
    }
  );
  return (
    <>
      <Header title='Edit item' />
      <ContentHeader
        title='Edit item'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
      />
      <ContentBody>
        <Box maxW='1080px' width='100%'>
          {status === 'loading' ? null : status === 'error' ? (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>{(error as Error).message}</AlertTitle>
            </Alert>
          ) : (
            <Formik
              initialValues={{
                ...data.data.data,
                pricePerItem: parseFloat(data.data.data.pricePerItem.slice(1)),
                actPricePerItem:
                  parseFloat(data.data.data.actPricePerItem?.slice(1)) || '',
                quantity: parseInt(data.data.data.quantity),
                tax:
                  parseFloat(
                    data.data.data.tax?.slice(0, data.data.data.tax?.length)
                  ) || '',
                usShippingFee:
                  parseFloat(data.data.data.usShippingFee?.slice(1)) || '',
                extraShippingCost:
                  parseFloat(data.data.data.extraShippingCost?.slice(1)) || '',
                estWgtPerItem:
                  parseFloat(data.data.data.estWgtPerItem?.split(' ')[0]) || '',
                actWgtPerItem:
                  parseFloat(data.data.data.actWgtPerItem?.split(' ')[0]) || '',
                commissionRate:
                  parseFloat(
                    data.data.data.commissionRate?.slice(
                      0,
                      data.data.data.commissionRate
                    )
                  ) || '',
              }}
              onSubmit={(values) => {
                delete values.createdAt;
                delete values.updatedAt;
                delete values.orderDate;
                delete values.actualCost;
                // delete values._id;
                delete values.pricePerItem;
                mutate(values);
              }}
            >
              {() => (
                <Form>
                  {isError && (
                    <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>{(mutateError as Error).message}</AlertTitle>
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
                      placeholder='Item name'
                      label='Item name'
                      required
                    />
                    <InputField
                      type='text'
                      name='link'
                      placeholder='Item link'
                      label='Item link'
                      required
                    />
                    <InputField
                      type='number'
                      name='actPricePerItem'
                      placeholder='Price / Item'
                      label='Price / Item'
                      required
                    />
                    <InputField
                      type='number'
                      name='quantity'
                      placeholder='Quantity'
                      label='Quantity'
                      required
                    />
                    <InputField
                      type='number'
                      name='tax'
                      placeholder='Tax'
                      label='Tax'
                    />
                    <InputField
                      type='number'
                      name='usShippingFee'
                      placeholder='US Shipping Fee'
                      label='US Shipping Fee'
                    />
                    <InputField
                      type='number'
                      name='extraShippingCost'
                      placeholder='Extra shipping'
                      label='Extra shipping'
                    />
                    <InputField
                      type='number'
                      name='estWgtPerItem'
                      placeholder='Estimated Weight'
                      label='Estimated Weight Per Item'
                    />
                    <InputField
                      type='number'
                      name='actWgtPerItem'
                      placeholder='Actual Weight'
                      label='Actual Weight Per Item'
                    />
                    <InputField
                      type='text'
                      name='trackingLink'
                      placeholder='Tracking Link'
                      label='Tracking Link'
                    />
                    <InputField
                      type='text'
                      name='invoiceLink'
                      placeholder='Invoice link'
                      label='Invoice link'
                    />
                    <InputField
                      type='text'
                      name='notes'
                      placeholder='Notes'
                      label='Notes'
                      textarea
                    />
                  </Grid>
                  <Button
                    mr='16px'
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type='submit'
                    colorScheme='teal'
                    isLoading={isLoading}
                  >
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          )}
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
