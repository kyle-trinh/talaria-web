import {
  Button,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
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

interface ResponseError {
  status: string;
  message: string;
}

const Register = () => {
  const route = useRouter();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: { email: string; password: string }) =>
      client('http://localhost:4444/api/v1/users/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        route.push('/profile');
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
                  {(error as ResponseError).message
                    .split('.')
                    .splice(1)
                    .map((err) => (
                      <p>{err}</p>
                    ))}
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
            <VStack justifyContent='flex-start' spacing='8px'>
              <InputField
                name='firstName'
                placeholder='First Name'
                label='First Name'
                type='text'
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
              />
              <InputField
                name='password'
                placeholder='Password'
                label='Password'
                type='password'
              />
              <InputField
                name='passwordConfirm'
                placeholder='Password Confirm'
                label='Password Confirm'
                type='password'
              />
            </VStack>
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
          </Form>
        )}
      </Formik>
    </Box>
  );
};
export const getServerSideProps: GetServerSideProps = async function ({
  req,
  res,
}: GetServerSidePropsContext) {
  if (req.cookies?.jwt) {
    try {
      const queryClient = new QueryClient();
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
        redirect: {
          destination: '/profile',
          permanenet: false,
        },
      };
    } catch (err) {
      return {
        props: {},
      };
    }
  } else {
    return {
      props: {},
    };
  }
};

export default Register;
