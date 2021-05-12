import {
  Button,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useMutation, QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { client } from '../utils/api-client';
import { dehydrate } from 'react-query/hydration';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import Link from 'next/link';
import Header from '../components/Header';
import { BASE_URL } from '../constants';
import { checkAuth } from '../utils/checkAuth';
import { withSession } from '../lib/withSession';
import { IncomingMessage } from 'node:http';

interface ResponseError {
  status: string;
  message: string;
}

const Register = () => {
  const route = useRouter();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: { email: string; password: string; profile: any }) =>
      client(`api/register`, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          role: 'admin',
          profile: {
            ...data.profile,
            commissionRates: [
              { website: 'amazon', rate: 0.05 },
              { website: 'sephora', rate: 0.05 },
              { website: 'bestbuy', rate: 0.05 },
              { website: 'walmart', rate: 0.05 },
              { website: 'target', rate: 0.05 },
              { website: 'costco', rate: 0.05 },
            ],
            discountRates: [
              { website: 'amazon', rate: 0.08 },
              { website: 'sephora', rate: 0.08 },
              { website: 'bestbuy', rate: 0.08 },
              { website: 'walmart', rate: 0.08 },
              { website: 'target', rate: 0.08 },
              { website: 'costco', rate: 0.08 },
            ],
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        route.push('/me');
      },
    }
  );

  return (
    <Box maxW='400' w='100%'>
      <Header title='Register' />
      <Box textStyle='h1' textAlign='center' color='teal.600' mb={20}>
        Register
      </Box>
      <Formik
        initialValues={{
          email: '',
          password: '',
          passwordConfirm: '',
          firstName: '',
          lastName: '',
          profile: {
            dob: '',
          },
        }}
        onSubmit={(values) => {
          mutate(values);
        }}
      >
        {() => (
          <Form>
            {isError ? (
              <Alert status='error'>
                <AlertIcon />
                <AlertTitle mr={2}>
                  {
                    (error as Error).message
                    // .split('.')
                    // .splice(1)
                    // .map((err) => (
                    //   <p>{err}</p>
                  }
                </AlertTitle>
              </Alert>
            ) : null}
            {isSuccess ? (
              <Alert status='success'>
                <AlertIcon />
                <AlertTitle mr={2}>
                  Register successful! Redirecting...
                </AlertTitle>
              </Alert>
            ) : null}
            <VStack spacing='12px' alignItems='stretch' width='400px'>
              <InputField
                name='firstName'
                placeholder='First Name'
                label='First Name'
                type='text'
                required
              />
              <InputField
                name='lastName'
                placeholder='Last Name'
                label='Last Name'
                type='text'
              />
              <InputField
                name='email'
                placeholder='Email'
                label='Email'
                type='email'
                required
              />
              <InputField
                name='profile.dob'
                label='Date of birth'
                type='date'
                required
              />
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
                required
              />
              <InputField
                name='passwordConfirm'
                placeholder='Password Confirm'
                label='Password Confirm'
                type='password'
                required
              />
            </VStack>
            <HStack spacing='8px' mt='16px'>
              <Button
                colorScheme='teal'
                type='submit'
                isLoading={isLoading}
                loadingText='Submitting'
              >
                Register
              </Button>
              <Button colorScheme='gray' ml={3}>
                <Link href='/login'>
                  <a>Login</a>
                </Link>
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req }: any) {
    const jwt = req.session.get('jwt');
    if (jwt) {
      return {
        redirect: {
          destination: '/me',
          permanent: false,
        },
      };
    }
    return { props: {} };
  }
);

export default Register;
