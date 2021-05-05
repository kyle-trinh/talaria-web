import {
  Box,
  Center,
  Grid,
  HStack,
  Link,
  List,
  ListIcon,
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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import ExternalLink from '../../../components/ExternalLink';
import NextLink from 'next/link';
import { FaPercentage, FaAddressCard } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';
import { Form, Formik } from 'formik';
import { InputField } from '../../../components/InputField';
import { BiCheckCircle } from 'react-icons/bi';

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
                    <Grid
                      gridTemplateColumns='repeat(2, 1fr)'
                      gridGap='16px'
                      gridColumnGap='24px'
                    >
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
                      {dataCommission.data.data.length === 0 && (
                        <Tr>
                          <Td>No commissions yet!</Td>
                        </Tr>
                      )}
                      {dataCommission.data.data.map((commission) => (
                        <CommissionRow
                          key={commission._id}
                          commission={commission}
                          currentTime={currentTime}
                        />
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
          <Bills id={id} />
        </Box>
      </Box>
    </>
  );
}

function Bills({ id }) {
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(8);
  const { data, status, error } = useQuery(['bills', id, page, limit], () =>
    client(
      `${BASE_URL}/bills?sort=_id&customer=${id}&page=${page}&limit=${limit}`
    )
  );

  return (
    <Box mb='32px' minH='500px'>
      <HStack justifyContent='space-between'>
        <Text
          as='h2'
          fontWeight='bold'
          mb='16px'
          fontSize='32px'
          color='gray.600'
        >
          Purchased
        </Text>
        <HStack justifyContent='flex-end' spacing='8px'>
          <Button
            colorScheme='teal'
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button
            colorScheme='teal'
            disabled={
              status === 'success' &&
              page === Math.ceil(data.data.totalCount / limit)
            }
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </HStack>
      </HStack>
      {status === 'loading' ? null : status === 'error' ? (
        <Text>{(error as Error).message}</Text>
      ) : (
        status === 'success' && (
          <>
            <Table>
              <Thead>
                <Tr>
                  <Th textTransform='capitalize' bg='gray.300'>
                    Id
                  </Th>
                  <Th textTransform='capitalize' bg='gray.300'>
                    Created at
                  </Th>
                  <Th textTransform='capitalize' bg='gray.300'>
                    Items
                  </Th>
                  <Th textTransform='capitalize' bg='gray.300'>
                    Recevied
                  </Th>
                  <Th textTransform='capitalize' bg='gray.300'>
                    Total Bill
                  </Th>
                  <Th textTransform='capitalize' bg='gray.300'>
                    Status
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.data.length === 0 && (
                  <Tr>
                    <Td>No bills existed</Td>
                  </Tr>
                )}
                {data.data.data.map((bill) => (
                  <BillRow key={bill._id} bill={bill} />
                ))}
              </Tbody>
            </Table>
          </>
        )
      )}
    </Box>
  );
}

function BillRow({ bill }) {
  return (
    <Tr>
      <Td>
        <Tooltip label={bill._id} aria-label='Tooltip'>
          <span>
            <NextLink href={`/bills/${bill._id}`}>
              {bill._id.slice(0, 16) + '...'}
            </NextLink>
          </span>
        </Tooltip>
      </Td>
      <Td>{bill.createdAt}</Td>
      <Td>
        <Popover>
          <PopoverTrigger>
            <Button size='xs'>Item details</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Item list</PopoverHeader>
            <PopoverBody>
              <List spacing={3}>
                {bill.items.map((item, index) => (
                  <NextLink href={`/items/${item._id}`} passHref key={index}>
                    <Link>
                      <ListItem>
                        <ListIcon as={BiCheckCircle} color='green.500' />
                        {`(${item.name} - ${item.pricePerItem}) x ${item.quantity}`}
                      </ListItem>
                    </Link>
                  </NextLink>
                ))}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Td>
      <Td>{bill.moneyReceived}</Td>
      <Td>{bill.actCharge}</Td>
      <Td>
        <Tag
          variant='solid'
          colorScheme={
            bill.status === 'not-paid'
              ? 'red'
              : bill.status === 'partially-paid'
              ? 'blue'
              : bill.status === 'paid'
              ? 'gray'
              : 'gray'
          }
        >
          {bill.status}
        </Tag>
      </Td>
    </Tr>
  );
}

function CommissionRow({ commission, currentTime }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isLoading, status } = useMutation(
    (data) =>
      client(`${BASE_URL}/commissions/${commission._id}/pay`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSettled: () => {
        onClose();
        queryClient.invalidateQueries([
          'commissions',
          router.query.id,
          currentTime,
        ]);
      },
    }
  );
  return (
    <Tr>
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
          onClick={onOpen}
        >
          Pay
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <Formik
            initialValues={{
              amount: parseFloat(
                commission.amount.slice(1).split(',').join('')
              ),
            }}
            onSubmit={(value) => {
              mutate(value);
            }}
          >
            {() => (
              <Form>
                <ModalContent>
                  <ModalHeader>Enter amount</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <InputField
                      name='amount'
                      placeholder='Amount'
                      label='Amount (Edit if you want to pay more)'
                      type='number'
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      colorScheme='teal'
                      type='submit'
                      isLoading={isLoading}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Form>
            )}
          </Formik>
        </Modal>
      </Td>
    </Tr>
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
