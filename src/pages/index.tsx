import { Box } from '@chakra-ui/layout';
import { Icon, Link } from '@chakra-ui/react';
import Header from '../components/Header';
import { RiUser5Fill } from 'react-icons/ri';
import { Form, Formik } from 'formik';
import { InputField } from '../components/InputField';
import NextLink from 'next/link';

const Index = () => {
  return (
    <>
      <Header title='Dashboard' />
      <Box
        gridArea='header'
        bg='white'
        borderTopLeftRadius='2xl'
        borderTopRightRadius='xl'
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        padding='0 40px'
      >
        <Box textStyle='title' as='h1'>
          Dashboard
        </Box>
        <Box>
          <Icon as={RiUser5Fill} w={45} h={45} color='gray' />
        </Box>
      </Box>
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
        <Box>
          <Box display='flex' justifyContent='space-between'>
            <Box w={500}>
              <Formik
                initialValues={{ search: '' }}
                onSubmit={(values) => console.log(values)}
              >
                {() => (
                  <Form>
                    <InputField
                      label='Searching'
                      type='text'
                      name='search'
                      placeholder='Search for items...'
                    />
                  </Form>
                )}
              </Formik>
            </Box>
            <Box>
              <NextLink href='/items/create' passHref>
                <Link
                  backgroundColor='teal.600'
                  color='#fff'
                  padding='8px 12px'
                  borderRadius={6}
                  fontWeight='bold'
                  textDecoration='none'
                  _hover={{
                    background: 'teal.700',
                    textDecoration: 'none',
                  }}
                >
                  Add items +
                </Link>
              </NextLink>
            </Box>
          </Box>
          <Box>Table</Box>
        </Box>
      </Box>
    </>
  );
};

export default Index;
