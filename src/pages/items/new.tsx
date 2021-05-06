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
  Select,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { InputField } from '../../components/InputField';
import { client } from '../../utils/api-client';
import { QueryClient, useMutation } from 'react-query';
import { BASE_URL } from '../../constants';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../hooks/useMe';
import { removeBlankField } from '../../utils';

interface I_FormData {
  name: string;
  link: string;
  pricePerItem: number | string;
  quantity: number;
  estWgtPerItem: number | string;
  website: string;
  itemType: string;
  warehouse: string;
  commissionRate?: number | string;
  extraShippingCost?: number | string;
  notes?: string;
}

export default function NewItem() {
  const route = useRouter();
  const { user, isLoading: isUserLoading, status: userStatus } = useMe();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: I_FormData) => {
      const submitData = removeBlankField({
        ...data,
        actPricePerItem: data.pricePerItem,
      });
      return client(`${BASE_URL}/items`, {
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
        route.push('/items');
      },
    }
  );
  return (
    <>
      <Header title='Create a new item' />
      <ContentHeader
        title='Create a new item'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
      />
      <ContentBody>
        <Box maxW='1080px' width='100%'>
          <Formik
            initialValues={{
              name: '',
              link: '',
              pricePerItem: '',
              quantity: 1,
              estWgtPerItem: '',
              website: 'amazon',
              itemType: '',
              warehouse: '60528fdd27ae2f0b7f0d843c',
              commissionRate: '',
              extraShippingCost: '',
              notes: '',
            }}
            onSubmit={(values: I_FormData) => {
              mutate(values);
            }}
          >
            {(props) => (
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
                    <AlertTitle mr={2}>Item created! Redirecting...</AlertTitle>
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
                    label='Item Link'
                    required
                  />
                  <InputField
                    type='number'
                    name='pricePerItem'
                    placeholder='Item price'
                    label='Item price'
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
                    name='estWgtPerItem'
                    placeholder='Estimated weight'
                    label='Estimated weight'
                    required
                  />
                  <InputField
                    type='number'
                    name='extraShippingCost'
                    placeholder='Extra shipping'
                    label='Extra shipping cost'
                  />
                  <InputField
                    type='number'
                    name='commissionRate'
                    placeholder='Commission rate'
                    label='Commission rate for affiliate'
                  />
                  <FormControl>
                    <FormLabel htmlFor='website'>Order Website</FormLabel>
                    <Select
                      placeholder='Select option'
                      id='website'
                      name='website'
                      value={props.values.website}
                      onChange={(e) =>
                        props.setFieldValue('website', e.target.value)
                      }
                      required
                    >
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
                  <FormControl>
                    <FormLabel htmlFor='itemType'>Item Type</FormLabel>
                    <Select
                      id='itemType'
                      name='itemType'
                      value={props.values.itemType}
                      onChange={(e) =>
                        props.setFieldValue('itemType', e.target.value)
                      }
                    >
                      <option value=''>Select one</option>
                      <option value='cosmetics'>cosmetics</option>
                      <option value='toys'>toys</option>
                      <option value='electronics'>electronics</option>
                      <option value='accessories'>accessories</option>
                      <option value='others'>others</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor='warehouse'>Warehouse</FormLabel>
                    <Select
                      placeholder='Select option'
                      id='warehouse'
                      name='warehouse'
                      value={props.values.warehouse}
                      onChange={(e) =>
                        props.setFieldValue('warehouse', e.target.value)
                      }
                      required
                    >
                      <option value=''>Select one</option>
                      <option value='60528fdd27ae2f0b7f0d843c'>UNIHAN</option>
                    </Select>
                  </FormControl>
                  <InputField
                    type='text'
                    name='notes'
                    placeholder='Notes'
                    label='Notes'
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
