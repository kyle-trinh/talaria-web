import { withIronSession } from 'next-iron-session';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { client } from '../utils/api-client';
import Header from '../components/Header';
import ContentHeader from '../components/ContentHeader';
import { Box, Grid, HStack, List, ListItem, VStack } from '@chakra-ui/layout';
import {
  Button,
  Image,
  Icon,
  Input,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { RiEditFill } from 'react-icons/ri';
import { useRef } from 'react';
import { BASE_URL } from '../constants';
import NextLink from 'next/link';
import ExternalLink from '../components/ExternalLink';
import { useMe } from '../hooks/useMe';

const Profile = () => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading, status } = useMe();

  const {
    mutate,
    isLoading: isImageLoading,
    status: mutateStatus,
  } = useMutation(
    (formData: any) =>
      client(`${BASE_URL}/users/updateImage`, {
        method: 'PATCH',
        body: formData,

        credentials: 'include',
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['userProfile']);
      },
    }
  );
  return (
    <>
      <Header title='My profile' />
      <ContentHeader title='My profile' user={user} isLoading={isLoading} />
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
        <HStack
          marginTop={8}
          w='100%'
          justifyContent='flex-start'
          alignItems='center'
        >
          <Box position='relative' width='250px' mr='32px'>
            {status === 'loading' || mutateStatus === 'loading' ? (
              <SkeletonCircle w='200px' h='200px' />
            ) : (
              <Image
                objectFit='cover'
                boxSize='200px'
                borderRadius='50%'
                src={`http://localhost:4444/api/v1/users/images/${user.profilePicture}`}
                fallback={<SkeletonCircle w='200px' h='200px' />}
              />
            )}
            <input
              type='file'
              hidden
              ref={inputRef}
              onChange={(e) => {
                if (e.target.files.length >= 1) {
                  const image = e.target.files[0];
                  const formData = new FormData();
                  formData.append('image', image, image.name);
                  mutate(formData);
                } else {
                  return;
                }
              }}
            />
            <Icon
              onClick={() => inputRef.current.click()}
              as={RiEditFill}
              cursor='pointer'
              w={8}
              h={8}
              color='teal'
              position='absolute'
              bottom={0}
              right={'20px'}
            />
          </Box>
          {status === 'loading' || mutateStatus === 'loading' ? null : (
            <Box>
              <Grid
                gridTemplateColumns='repeat(3, 1fr)'
                gridGap='32px'
                borderBottom='1px solid gray.400'
              >
                <Text
                  gridColumn='1 / span 1'
                  fontWeight='bold'
                  color='gray.600'
                >
                  First Name
                </Text>
                <Text gridColumn='2 / span 2' textTransform='capitalize'>
                  {user.firstName}
                </Text>
              </Grid>
              <Grid gridTemplateColumns='repeat(3, 1fr)' gridGap='32px'>
                <Text
                  gridColumn='1 / span 1'
                  fontWeight='bold'
                  color='gray.600'
                >
                  Last Name
                </Text>
                <Text gridColumn='2 / span 2' textTransform='capitalize'>
                  {user.lastName}
                </Text>
              </Grid>
              <Grid gridTemplateColumns='repeat(3, 1fr)' gridGap='32px'>
                <Text
                  gridColumn='1 / span 1'
                  fontWeight='bold'
                  color='gray.600'
                >
                  Email
                </Text>
                <Text gridColumn='2 / span 2'>{user.email}</Text>
              </Grid>
              <Grid gridTemplateColumns='repeat(3, 1fr)' gridGap='32px'>
                <Text
                  gridColumn='1 / span 1'
                  fontWeight='bold'
                  color='gray.600'
                >
                  Role
                </Text>
                <Text gridColumn='2 / span 2' textTransform='capitalize'>
                  {user.role}
                </Text>
              </Grid>
              <Grid gridTemplateColumns='repeat(3, 1fr)' gridGap='32px'>
                <Text
                  gridColumn='1 / span 1'
                  fontWeight='bold'
                  color='gray.600'
                >
                  Phone number
                </Text>
                <Text gridColumn='2 / span 2' textTransform='capitalize'>
                  {user.profile.phoneNumbers.length > 0
                    ? user.profile.phoneNumbers[
                        user.profile.phoneNumbers.length - 1
                      ]
                    : 'N/A'}
                </Text>
              </Grid>
              <Grid gridTemplateColumns='repeat(3, 1fr)' gridGap='32px'>
                <Text
                  gridColumn='1 / span 1'
                  fontWeight='bold'
                  color='gray.600'
                >
                  Date of birth
                </Text>
                <Text gridColumn='2 / span 2' textTransform='capitalize'>
                  {user.profile.dob}
                </Text>
              </Grid>
            </Box>
          )}
        </HStack>
        {status === 'loading' || mutateStatus === 'loading' ? null : (
          <Box mt='40px'>
            <Text as='h2' fontSize='32px' fontWeight='bold' color='gray.500'>
              Profile details
            </Text>
            <VStack alignItems='flex-start'>
              <Box>
                <Text as='h3' fontSize='20px'>
                  Social medias
                </Text>
                <List>
                  {user.profile.socialMedias.map((social) => (
                    <ExternalLink
                      href={`http://${social.link}`}
                      key={social._id}
                    >
                      <ListItem key={social._id}>
                        {social.website}: {social.link}
                      </ListItem>
                    </ExternalLink>
                  ))}
                </List>
              </Box>
              <Box>
                <Text as='h3' fontSize='20px'>
                  Commission Rates
                </Text>
                <List>
                  {user.profile.commissionRates.map((rate) => (
                    <ListItem key={rate._id}>
                      {rate.website}:{' '}
                      {parseFloat(rate.rate['$numberDecimal']).toLocaleString(
                        'en-GB',
                        {
                          style: 'percent',
                          maximumSignificantDigits: 4,
                        }
                      )}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box>
                <Text as='h3' fontSize='20px'>
                  Bank accounts
                </Text>
                <Text>{user.profile.bankAccts.length === 0 && 'N/A'}</Text>
                <List>
                  {user.profile.bankAccts.map((acct) => (
                    <ListItem key={acct._id}>
                      {acct.bankName} - {acct.bankLocation}: {acct.acctNumber}
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box>
                <Text as='h3' fontSize='20px'>
                  Address
                </Text>

                {user.profile.address.length > 0 ? (
                  <Text>
                    {
                      user.profile.address[user.profile.address.length - 1]
                        .streetAddr
                    }
                    ,{' '}
                    {user.profile.address[user.profile.address.length - 1].city}
                  </Text>
                ) : (
                  'N/A'
                )}
              </Box>
            </VStack>
          </Box>
        )}
      </Box>
    </>
  );
};

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

export default Profile;
