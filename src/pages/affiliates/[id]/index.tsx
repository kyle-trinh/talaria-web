import {
  Box,
  Center,
  Grid,
  HStack,
  List,
  ListItem,
  Text,
} from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import { BASE_URL } from '../../../constants';
import { client } from '../../../utils/api-client';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../../hooks/useMe';
import { SkeletonCircle } from '@chakra-ui/skeleton';
import { TiSocialFacebookCircular } from 'react-icons/ti';
import { ImPhone } from 'react-icons/im';
import {
  Image,
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Editable,
  EditableInput,
  EditablePreview,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import ExternalLink from '../../../components/ExternalLink';
import NextLink from 'next/link';
import { IoPlayBackCircle } from 'react-icons/io5';

export default function AffiliateDetail({ id }) {
  const router = useRouter();
  const { user, isLoading, status } = useMe();

  const queryClient = useQueryClient();

  const { data, status: affiliateStatus } = useQuery(['affiliate', id], () =>
    client(`${BASE_URL}/users/${id}`, { credentials: 'include' })
  );
  const currentDate = new Date(Date.now());
  const [currentTime, setCurrentTime] = React.useState(
    `${currentDate.getFullYear()}-${currentDate.getMonth() > 9 ? '' : '0'}${
      currentDate.getMonth() + 1
    }`
  );
  const [currentYear, currentMonth] = currentTime.split('-');
  const { data: dataCommission, status: commissionStatus } = useQuery(
    ['commissions', id, currentTime],
    () => client(`${BASE_URL}/commissions/${id}/${currentYear}/${currentMonth}`)
  );

  const {
    mutate: pay,
    isLoading: isPayLoading,
    status: payStatus,
    error: payError,
  } = useMutation(
    () =>
      client(`${BASE_URL}/commissions/${id}/${currentYear}/${currentMonth}`, {
        method: 'PATCH',
        credentials: 'include',
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['commissions', id, currentTime]);
      },
    }
  );

  const isPayable = (arr) => {
    for (const item of arr) {
      if (item.status !== 'paid') {
        return true;
      }
    }
    return false;
  };

  const affiliate = affiliateStatus === 'success' && data.data.data;

  return (
    <>
      <Header title='Affiliate details' />
      <ContentHeader
        title='Affiliate details'
        user={user}
        isLoading={isLoading}
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
        <Box mt={8} w='100%'>
          <HStack alignItems='flex-start'>
            <Box position='relative' width='250px' mr='32px'>
              {affiliateStatus === 'loading' ? (
                <SkeletonCircle w='200px' h='200px' />
              ) : affiliateStatus === 'error' ? (
                <Text>error</Text>
              ) : (
                affiliateStatus === 'success' && (
                  <Image
                    objectFit='cover'
                    boxSize='200px'
                    borderRadius='50%'
                    src={`http://localhost:4444/api/v1/users/images/${affiliate.profilePicture}`}
                    fallback={<SkeletonCircle w='200px' h='200px' />}
                  />
                )
              )}
            </Box>
            {affiliateStatus === 'loading' ? null : affiliateStatus ===
              'error' ? (
              <Text>Error</Text>
            ) : (
              affiliateStatus === 'success' && (
                <Box>
                  <Text
                    as='h2'
                    textTransform='capitalize'
                    fontSize='32px'
                    color='gray.600'
                    fontWeight='bold'
                  >
                    {affiliate.firstName} {affiliate?.lastName}
                  </Text>
                  <Tag
                    colorScheme='teal'
                    variant='solid'
                    textTransform='capitalize'
                  >
                    {affiliate.role}
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
                    <Grid gridTemplateColumns='repeat(2, 1fr)' gridGap='16px'>
                      <Box>
                        <Title text='Email' />
                        <Text>{affiliate.email}</Text>
                      </Box>
                      <Box>
                        <Title text='Date of birth' />
                        <Text>{affiliate.profile.dob}</Text>
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
                              <List>
                                {affiliate.profile.socialMedias.map(
                                  (social) => (
                                    <ExternalLink
                                      href={`http://${social.link}`}
                                      key={social._id}
                                    >
                                      <ListItem>{social.link}</ListItem>
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
                              <List>
                                {affiliate.profile.phoneNumbers.map(
                                  (number, index) => (
                                    <ExternalLink
                                      href={`tel:${number}`}
                                      key={index}
                                    >
                                      <ListItem>
                                        {number}{' '}
                                        {index ===
                                          affiliate.profile.phoneNumbers
                                            .length -
                                            1 && ' - Newest'}
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
                              rightIcon={<ImPhone />}
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
                                {affiliate.profile.commissionRates.map(
                                  (rate) => (
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
                              rightIcon={<ImPhone />}
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
                              {affiliate.profile.bankAccts.length === 0 &&
                                'N/A'}
                              <List>
                                {affiliate.profile.bankAccts.map((acct) => (
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
                              rightIcon={<ImPhone />}
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
                              {affiliate.profile.address.length === 0 && 'N/A'}
                              <List>
                                {affiliate.profile.address.map((single) => (
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
              )
            )}
          </HStack>
          <Box>
            <HStack justifyContent='space-between' alignItems='center'>
              <Text as='h2' fontWeight='bold' fontSize='32px' color='gray.600'>
                Commissions
              </Text>
            </HStack>
            {commissionStatus === 'loading' ? null : commissionStatus ===
              'error' ? (
              <Text>Error</Text>
            ) : (
              commissionStatus === 'success' && (
                <>
                  <Center
                    fontWeight='bold'
                    color='teal'
                    my='8px'
                    fontSize='20px'
                  >
                    <Editable
                      defaultValue={`${currentYear}-${currentMonth}`}
                      onSubmit={(value) => {
                        setCurrentTime(value);
                      }}
                      onChange={(value) => {
                        setCurrentTime(value);
                      }}
                    >
                      <EditablePreview />
                      <EditableInput type='month' />
                    </Editable>
                  </Center>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th textTransform='capitalize' bg='gray.300'>
                          Created at
                        </Th>
                        <Th textTransform='capitalize' bg='gray.300'>
                          Amount
                        </Th>
                        <Th textTransform='capitalize' bg='gray.300'>
                          Bill
                        </Th>
                        <Th textTransform='capitalize' bg='gray.300'>
                          Status
                        </Th>
                        <Th textTransform='capitalize' bg='gray.300'>
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {dataCommission.data.data.map((commission) => (
                        <Tr key={commission._id}>
                          <Td>{commission.createdAt}</Td>
                          <Td>{commission.amount}</Td>
                          <Td>
                            <NextLink href={`/bills/${commission.bill._id}`}>
                              {commission.bill._id}
                            </NextLink>
                          </Td>
                          <Td>
                            <Tag
                              colorScheme={
                                commission.status === 'pending'
                                  ? 'red'
                                  : commission.status === 'partially-paid'
                                  ? 'blue'
                                  : commission.status === 'paid'
                                  ? 'gray'
                                  : 'gray'
                              }
                            >
                              {commission.status}
                            </Tag>
                          </Td>
                          <Td>
                            <Button
                              size='sm'
                              colorScheme='blue'
                              disabled={commission.status === 'paid'}
                            >
                              Pay
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  <Center mb='32px'>
                    <Button
                      mt='8px'
                      colorScheme='teal'
                      onClick={() => pay()}
                      isLoading={isPayLoading}
                      isDisabled={!isPayable(dataCommission.data.data)}
                    >
                      Pay for this month
                    </Button>
                  </Center>
                </>
              )
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Title({ text, ...props }) {
  return (
    <Text fontWeight='bold' color='gray.400' {...props}>
      {text}
    </Text>
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
