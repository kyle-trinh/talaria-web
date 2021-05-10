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
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from '@chakra-ui/react';
import { RiBankFill, RiEditFill } from 'react-icons/ri';
import React, { useRef } from 'react';
import { BASE_URL } from '../constants';
import NextLink from 'next/link';
import ExternalLink from '../components/ExternalLink';
import { useMe } from '../hooks/useMe';
import { renderDate } from '../utils';
import { TiSocialFacebookCircular } from 'react-icons/ti';
import { ImPhone } from 'react-icons/im';
import { FaAddressCard, FaPercentage } from 'react-icons/fa';

const Profile = ({ user }: { user: any }) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  // const { user: user2, isLoading, status: userStatus } = useMe();

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
      {/* <pre>{JSON.stringify(userSSR, null, 2)}</pre> */}
      <Header title='My profile' />
      <ContentHeader
        title='My profile'
        user={user}
        isLoading={false}
        status='success'
      />
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
            {/* {userStatus === 'loading' || mutateStatus === 'loading' ? (
              <SkeletonCircle w='200px' h='200px' />
            ) : ( */}
            <Image
              objectFit='cover'
              boxSize='200px'
              borderRadius='50%'
              src={`http://localhost:4444/api/v1/users/images/${user.profilePicture}`}
              fallback={<SkeletonCircle w='200px' h='200px' />}
            />
            {/* )} */}
            <input
              type='file'
              hidden
              ref={inputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length >= 1) {
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
              onClick={() => inputRef.current!.click()}
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
          {mutateStatus === 'loading' ? null : (
            <Box>
              <Text
                as='h2'
                textTransform='capitalize'
                fontSize='32px'
                color='gray.600'
                fontWeight='bold'
              >
                {user.firstName} {user?.lastName}
              </Text>
              <Tag
                colorScheme='teal'
                variant='solid'
                textTransform='capitalize'
              >
                {user.role}
              </Tag>
              <Box mt='16px'>
                <Text
                  as='h3'
                  fontWeight='bold'
                  color='gray.500'
                  fontSize='20px'
                  textTransform='uppercase'
                >
                  Personal Information
                </Text>
                <Grid
                  gridTemplateColumns='repeat(2, 1fr)'
                  gridGap='16px'
                  gridColumnGap='24px'
                >
                  <Box>
                    <Title text='Email' />
                    <Text>{user.email}</Text>
                  </Box>
                  <Box>
                    <Title text='Date of birth' />
                    <Text>{renderDate(user.profile.dob)}</Text>
                  </Box>
                  <Box>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          rightIcon={<TiSocialFacebookCircular />}
                          variant='outline'
                          colorScheme='teal'
                          size='sm'
                        >
                          Social medias
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Social medias</PopoverHeader>
                        <PopoverBody>
                          {user.profile.socialMedias.length === 0 && (
                            <Text>N/A</Text>
                          )}
                          <List>
                            {user.profile.socialMedias.map((social: any) => (
                              <ExternalLink
                                href={`http://${social.link}`}
                                key={social._id}
                              >
                                <ListItem>{social.link}</ListItem>
                              </ExternalLink>
                            ))}
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                  <Box>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          rightIcon={<ImPhone />}
                          variant='outline'
                          colorScheme='teal'
                          size='sm'
                        >
                          Phone numbers
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Phone numbers</PopoverHeader>
                        <PopoverBody>
                          {user.profile.phoneNumbers.length === 0 && (
                            <Text>N/A</Text>
                          )}
                          <List>
                            {user.profile.phoneNumbers.map(
                              (number: string, index: number) => (
                                <ExternalLink
                                  href={`tel:${number}`}
                                  key={index}
                                >
                                  <ListItem>
                                    {number}{' '}
                                    {index ===
                                      user.profile.phoneNumbers.length - 1 &&
                                      ' - Newest'}
                                  </ListItem>
                                </ExternalLink>
                              )
                            )}
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>

                  <Box>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          rightIcon={<FaPercentage />}
                          variant='outline'
                          colorScheme='teal'
                          size='sm'
                        >
                          Commission rates
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Commission Rates</PopoverHeader>
                        <PopoverBody>
                          <List>
                            <VStack
                              spacing='6px'
                              justifyContent='center'
                              alignItems='flex-start'
                            >
                              {user.profile.commissionRates.map((rate: any) => (
                                <ListItem key={rate._id}>
                                  <Tag
                                    colorScheme='teal'
                                    mr='6px'
                                    variant='solid'
                                  >
                                    {rate.website}
                                  </Tag>
                                  {parseFloat(
                                    rate.rate['$numberDecimal']
                                  ).toLocaleString('en-GB', {
                                    style: 'percent',
                                    maximumSignificantDigits: 4,
                                  })}
                                </ListItem>
                              ))}
                            </VStack>
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>

                  <Box>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          rightIcon={<FaPercentage />}
                          variant='outline'
                          colorScheme='teal'
                          size='sm'
                        >
                          Discount rates
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Discount rates</PopoverHeader>
                        <PopoverBody>
                          <List>
                            <VStack
                              spacing='6px'
                              alignItems='flex-start'
                              justifyContent='center'
                            >
                              {user.profile.discountRates.map((rate: any) => (
                                <ListItem key={rate._id}>
                                  <Tag
                                    colorScheme='teal'
                                    mr='6px'
                                    variant='solid'
                                  >
                                    {rate.website}
                                  </Tag>
                                  {parseFloat(
                                    rate.rate['$numberDecimal']
                                  ).toLocaleString('en-GB', {
                                    style: 'percent',
                                    maximumSignificantDigits: 4,
                                  })}
                                </ListItem>
                              ))}
                            </VStack>
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>

                  <Box>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          rightIcon={<RiBankFill />}
                          variant='outline'
                          colorScheme='teal'
                          size='sm'
                        >
                          Bank accounts
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Bank accounts</PopoverHeader>
                        <PopoverBody>
                          {user.profile.bankAccts.length === 0 && 'N/A'}
                          <List>
                            {user.profile.bankAccts.map((acct: any) => (
                              <ListItem key={acct._id}>
                                {acct.bankName} - {acct?.bankLocation}:{' '}
                                {acct.acctNumber}
                              </ListItem>
                            ))}
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                  <Box>
                    <Popover>
                      <PopoverTrigger>
                        <Button
                          rightIcon={<FaAddressCard />}
                          variant='outline'
                          colorScheme='teal'
                          size='sm'
                        >
                          Address
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Address</PopoverHeader>
                        <PopoverBody>
                          {user.profile.address.length === 0 && 'N/A'}
                          <List>
                            {user.profile.address.map((single: any) => (
                              <ListItem key={single._id}>
                                {single.streetAddr}, {single.city}
                              </ListItem>
                            ))}
                          </List>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                </Grid>
              </Box>
            </Box>
          )}
        </HStack>
      </Box>
    </>
  );
};

function Title({ text, ...props }: { text: string }) {
  return (
    <Text fontWeight='bold' color='gray.400' {...props}>
      {text}
    </Text>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req, res }: any) {
    const user = req.session.get('jwt');
    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      props: { user: req.session.get('user') },
    };
    // const queryClient = new QueryClient();
    // try {
    //   await queryClient.fetchQuery('userProfile', () =>
    //     client('http://localhost:4444/api/v1/users/me', {
    //       method: 'GET',
    //       credentials: 'include',
    //       headers: {
    //         Authorization: req.cookies?.jwt && `Bearer ${req.cookies.jwt}`,
    //       },
    //     })
    //   );

    //   return {
    //     props: { dehydratedState: dehydrate(queryClient) },
    //   };
    // } catch (err) {
    //   return {
    //     redirect: {
    //       destination: '/login',
    //       permanent: false,
    //     },
    //   };
    // }
  }
);

export default Profile;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: '2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8',
    cookieName: 'next.js/examples/with-iron-session',
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: false,
    },
  });
}
