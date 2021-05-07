import React, { useState } from 'react';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import ContentBody from '../../../components/styles/ContentBody';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Formik, Form, Field, FieldInputProps } from 'formik';
import { InputField } from '../../../components/InputField';
import { client } from '../../../utils/api-client';
import { QueryClient, useMutation, useQuery } from 'react-query';
import { BASE_URL } from '../../../constants';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../../hooks/useMe';
import { removeBlankField } from '../../../utils';
import ExternalLink from '../../../components/ExternalLink';
import { AiOutlineClose } from 'react-icons/ai';
interface SocialMedia {
  website: string;
  link: string;
}

interface BankAcct {
  bankName: string;
  acctNumber: string;
  bankLocation?: string;
}

interface CommissionRate {
  website: string;
  rate: number;
}

interface Address {
  streetAddr: string;
  city: string;
}

interface Profile {
  socialMedias?: SocialMedia[];
  phoneNumbers?: string[];
  bankAccts?: BankAcct[];
  commissionRates?: CommissionRate[];
  dob?: string;
  customerType?: string;
  address?: Address[];
  discountRates?: CommissionRate[];
}
interface I_FormData {
  firstName: string;
  lastName?: string;
  email: string;
  role: string;
  notes?: string;
  profile: Profile;
}

export default function NewUser({ id }: { id: string }) {
  const route = useRouter();
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [bankAccts, setBankAccts] = useState<BankAcct[]>([]);
  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([]);
  const [address, setAddress] = useState<Address[]>([]);
  const [discountRates, setDiscountRates] = useState<CommissionRate[]>([]);
  const { data: editData, status: editStatus, error: editError } = useQuery(
    ['user', id],
    () =>
      client(`${BASE_URL}/users/${id}`, {
        credentials: 'include',
      }),
    {
      onSuccess: (data) => {
        setSocialMedias(data.data.data.profile.socialMedias || []);
        setPhoneNumbers(data.data.data.profile.phoneNumbers || []);
        setBankAccts(data.data.data.profile.bankAccts || []);
        setCommissionRates(
          data.data.data.profile.commissionRates.map((rate) => {
            const newObj = { ...rate };
            newObj.rate = newObj.rate['$numberDecimal'];
            return newObj;
          }) || []
        );
        setAddress(data.data.data.profile.address || []);
        setDiscountRates(
          data.data.data.profile.discountRates.map((rate) => {
            const newObj = { ...rate };
            newObj.rate = newObj.rate['$numberDecimal'];
            return newObj;
          }) || []
        );
      },
    }
  );
  const {
    isOpen: isSmOpen,
    onOpen: onSmOpen,
    onClose: onSmClose,
  } = useDisclosure();
  const {
    isOpen: isPnOpen,
    onOpen: onPnOpen,
    onClose: onPnClose,
  } = useDisclosure();
  const {
    isOpen: isBaOpen,
    onOpen: onBaOpen,
    onClose: onBaClose,
  } = useDisclosure();
  const {
    isOpen: isAdOpen,
    onOpen: onAdOpen,
    onClose: onAdClose,
  } = useDisclosure();

  const { user, isLoading: isUserLoading, status: userStatus } = useMe();
  const { mutate, isLoading, isError, error, isSuccess } = useMutation(
    (data: I_FormData) => {
      const submitData = removeBlankField({
        ...data,
      });
      return client(`${BASE_URL}/users/${id}`, {
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
        route.push('/users');
      },
    }
  );

  const userData = editStatus === 'success' && editData.data.data;

  return (
    <>
      <Header title='Edit user' />
      <ContentHeader
        title='Edit user'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
      />
      <ContentBody>
        {editStatus === 'loading' ? null : editStatus === 'error' ? (
          <Alert status='error'>
            <AlertIcon />
            <AlertTitle>{(editError as Error).message}</AlertTitle>
          </Alert>
        ) : (
          editStatus === 'success' && (
            <Box maxW='1080px' width='100%'>
              <Formik
                initialValues={{
                  firstName: userData.firstName,
                  lastName: userData.lastName || '',
                  email: userData.email,
                  role: userData.role,
                  profile: {
                    socialMedias,
                    phoneNumbers,
                    commissionRates,
                    customerType: userData.profile.customerType || '',
                    address,
                    discountRates,
                    bankAccts,
                  },
                }}
                onSubmit={(values: I_FormData) => {
                  mutate({
                    ...values,
                    profile: {
                      socialMedias,
                      phoneNumbers,
                      commissionRates:
                        values.role !== 'customer' ? commissionRates : [],
                      customerType: values.profile.customerType || undefined,
                      address,
                      discountRates,
                      bankAccts,
                      dob: userData.profile.dob,
                    },
                  });
                }}
              >
                {(props) => (
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
                          User edited! Redirecting...
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
                        name='firstName'
                        placeholder='First Name'
                        label='First Name'
                        required
                      />
                      <InputField
                        type='text'
                        name='lastName'
                        placeholder='Last Name'
                        label='Last Name'
                      />
                      <InputField
                        type='email'
                        name='email'
                        placeholder='Email'
                        label='Email'
                        required
                      />
                      <Field name='role'>
                        {({ field }: { field: FieldInputProps<any> }) => (
                          <FormControl>
                            <FormLabel htmlFor='role'>Role</FormLabel>
                            <Select {...field} id='role' required>
                              <option value=''>Select one</option>
                              <option value='customer'>Customer</option>
                              <option value='affiliate'>Affiliate</option>
                            </Select>
                          </FormControl>
                        )}
                      </Field>
                      {props.values.role === 'customer' && (
                        <Field name='customerType'>
                          {({ field }: { field: FieldInputProps<any> }) => (
                            <FormControl>
                              <FormLabel htmlFor='customerType'>
                                Customer Type
                              </FormLabel>
                              <Select {...field} id='customerType' required>
                                <option value=''>Select one</option>
                                <option value='personal'>Personal</option>
                                <option value='wholesale'>Wholesale</option>
                              </Select>
                            </FormControl>
                          )}
                        </Field>
                      )}
                      <VStack alignItems='flex-start' justify='flex-start'>
                        <Text fontWeight='medium'>Social medias</Text>
                        <HStack spacing='8px'>
                          <Button colorScheme='blue' onClick={onSmOpen}>
                            Add social media
                          </Button>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Show added social medias</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Social media list</PopoverHeader>
                              <PopoverBody>
                                {socialMedias.length === 0 &&
                                  'Nothing here. Try adding some'}
                                <List spacing={3}>
                                  {socialMedias.map((social) => (
                                    <ListItem key={social.link}>
                                      <HStack justifyContent='space-between'>
                                        <ExternalLink
                                          href={`http://${social.link}`}
                                        >
                                          {social.website}
                                        </ExternalLink>
                                        <IconButton
                                          icon={<AiOutlineClose />}
                                          colorScheme='red'
                                          aria-label='delete item'
                                          size='xs'
                                          variant='outline'
                                          borderRadius='50%'
                                          onClick={() => {
                                            setSocialMedias(
                                              socialMedias.filter(
                                                (media) =>
                                                  media.link !== social.link
                                              )
                                            );
                                          }}
                                        />
                                      </HStack>
                                    </ListItem>
                                  ))}
                                </List>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </HStack>
                      </VStack>

                      <VStack alignItems='flex-start' justify='flex-start'>
                        <Text fontWeight='medium'>Phone numbers</Text>
                        <HStack spacing='8px'>
                          <Button colorScheme='blue' onClick={onPnOpen}>
                            Add phone number
                          </Button>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Show added phone numbers</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Phone number list</PopoverHeader>
                              <PopoverBody>
                                {phoneNumbers.length === 0 &&
                                  'Nothing here. Try adding some'}
                                <List spacing={3}>
                                  {phoneNumbers.map((phone) => (
                                    <ListItem key={phone}>
                                      <HStack justifyContent='space-between'>
                                        <Text>{phone}</Text>
                                        <IconButton
                                          icon={<AiOutlineClose />}
                                          colorScheme='red'
                                          aria-label='delete item'
                                          size='xs'
                                          variant='outline'
                                          borderRadius='50%'
                                          onClick={() => {
                                            setPhoneNumbers(
                                              phoneNumbers.filter(
                                                (number) => number !== phone
                                              )
                                            );
                                          }}
                                        />
                                      </HStack>
                                    </ListItem>
                                  ))}
                                </List>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </HStack>
                      </VStack>

                      <VStack alignItems='flex-start' justify='flex-start'>
                        <Text fontWeight='medium'>Bank accounts</Text>
                        <HStack spacing='8px'>
                          <Button colorScheme='blue' onClick={onBaOpen}>
                            Add bank account
                          </Button>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Show added bank account</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Bank account list</PopoverHeader>
                              <PopoverBody>
                                {bankAccts.length === 0 &&
                                  'Nothing here. Try adding some'}
                                <List spacing={3}>
                                  {bankAccts.map((acct) => (
                                    <ListItem key={acct.acctNumber}>
                                      <HStack justifyContent='space-between'>
                                        <Text>
                                          {acct.bankName} - {acct.bankLocation}:{' '}
                                          {acct.acctNumber}
                                        </Text>
                                        <IconButton
                                          icon={<AiOutlineClose />}
                                          colorScheme='red'
                                          aria-label='delete item'
                                          size='xs'
                                          variant='outline'
                                          borderRadius='50%'
                                          onClick={() => {
                                            setBankAccts(
                                              bankAccts.filter(
                                                (bank) =>
                                                  bank.acctNumber !==
                                                  acct.acctNumber
                                              )
                                            );
                                          }}
                                        />
                                      </HStack>
                                    </ListItem>
                                  ))}
                                </List>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </HStack>
                      </VStack>
                      {props.values.role !== 'customer' && (
                        <VStack alignItems='flex-start' justify='flex-start'>
                          <Text fontWeight='medium'>Commission rates</Text>
                          <HStack spacing='8px'>
                            <Popover>
                              <PopoverTrigger>
                                <Button>Show commission rates</Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Commission rates</PopoverHeader>
                                <PopoverBody>
                                  <List spacing={3}>
                                    {commissionRates.map((rate) => (
                                      <ListItem key={rate.website}>
                                        <HStack justifyContent='space-between'>
                                          <Text fontWeight='medium'>
                                            {rate.website}:
                                          </Text>
                                          <Editable
                                            defaultValue={rate.rate.toString()}
                                            onSubmit={(value) => {
                                              const index = commissionRates.findIndex(
                                                (com) =>
                                                  com.website === rate.website
                                              );
                                              const copyArr = [
                                                ...commissionRates,
                                              ];

                                              copyArr[index].rate = parseFloat(
                                                value
                                              );
                                              setCommissionRates(copyArr);
                                            }}
                                          >
                                            <EditablePreview />
                                            <EditableInput />
                                          </Editable>
                                        </HStack>
                                      </ListItem>
                                    ))}
                                  </List>
                                </PopoverBody>
                              </PopoverContent>
                            </Popover>
                          </HStack>
                        </VStack>
                      )}
                      <VStack alignItems='flex-start' justify='flex-start'>
                        <Text fontWeight='medium'>Discount rates</Text>
                        <HStack spacing='8px'>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Show discount rates</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Discount rates</PopoverHeader>
                              <PopoverBody>
                                <List spacing={3}>
                                  {discountRates.map((rate) => (
                                    <ListItem key={rate.website}>
                                      <HStack justifyContent='space-between'>
                                        <Text fontWeight='medium'>
                                          {rate.website}:
                                        </Text>
                                        <Editable
                                          defaultValue={rate.rate.toString()}
                                          onSubmit={(value) => {
                                            const index = discountRates.findIndex(
                                              (com) =>
                                                com.website === rate.website
                                            );
                                            const copyArr = [...discountRates];

                                            copyArr[index].rate = parseFloat(
                                              value
                                            );
                                            setDiscountRates(copyArr);
                                          }}
                                        >
                                          <EditablePreview />
                                          <EditableInput />
                                        </Editable>
                                      </HStack>
                                    </ListItem>
                                  ))}
                                </List>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </HStack>
                      </VStack>
                      <VStack alignItems='flex-start' justify='flex-start'>
                        <Text fontWeight='medium'>Address</Text>
                        <HStack spacing='8px'>
                          <Button colorScheme='blue' onClick={onAdOpen}>
                            Add address
                          </Button>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Show added address</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Address list</PopoverHeader>
                              <PopoverBody>
                                {address.length === 0 &&
                                  'Nothing here. Try adding some'}
                                <List spacing={3}>
                                  {address.map((single) => (
                                    <ListItem key={single.streetAddr}>
                                      <HStack justifyContent='space-between'>
                                        <Text>
                                          {single.streetAddr}, {single.city}
                                        </Text>
                                        <IconButton
                                          icon={<AiOutlineClose />}
                                          colorScheme='red'
                                          aria-label='delete item'
                                          size='xs'
                                          variant='outline'
                                          borderRadius='50%'
                                          onClick={() => {
                                            setAddress(
                                              address.filter(
                                                (singleAddr) =>
                                                  singleAddr.streetAddr !==
                                                  single.streetAddr
                                              )
                                            );
                                          }}
                                        />
                                      </HStack>
                                    </ListItem>
                                  ))}
                                </List>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </HStack>
                      </VStack>
                      <InputField
                        type='text'
                        name='notes'
                        placeholder='Notes'
                        label='Notes'
                        textarea
                      />
                    </Grid>
                    <HStack spacing='8px'>
                      <Button
                        onClick={() => {
                          route.back();
                        }}
                      >
                        Go Back
                      </Button>
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
      <Modal isOpen={isSmOpen} onClose={onSmClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new social media link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ website: '', link: '' }}
              onSubmit={(values) => {
                setSocialMedias([...socialMedias, values]);
                onSmClose();
              }}
            >
              {() => (
                <Form>
                  <VStack spacing='8px' alignItems='flex-start'>
                    <Field name='website'>
                      {({ field }: { field: FieldInputProps<any> }) => (
                        <FormControl>
                          <FormLabel htmlFor='website'>Website</FormLabel>
                          <Select id='website' {...field} required>
                            <option value=''>Select one</option>
                            <option value='facebook'>Facebook</option>
                            <option value='tiktok'>Tiktok</option>
                            <option value='instagram'>Instagram</option>
                            <option value='zalo'>Zalo</option>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    <InputField
                      type='text'
                      name='link'
                      placeholder='link'
                      label='Link'
                      required
                    />
                    <Button mb='8px' colorScheme='teal' type='submit'>
                      Add
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isPnOpen} onClose={onPnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new phone number</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ phoneNumber: '' }}
              onSubmit={(values) => {
                setPhoneNumbers([values.phoneNumber, ...phoneNumbers]);
                onPnClose();
              }}
            >
              {() => (
                <Form>
                  <VStack spacing='8px' alignItems='flex-start'>
                    <InputField
                      type='text'
                      name='phoneNumber'
                      placeholder='Phone Number'
                      label='Phone Number'
                      required
                    />
                    <Button mb='8px' colorScheme='teal' type='submit'>
                      Add
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isBaOpen} onClose={onBaClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new bank account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ bankName: '', acctNumber: '', bankLocation: '' }}
              onSubmit={(values) => {
                setBankAccts([values, ...bankAccts]);
                onBaClose();
              }}
            >
              {() => (
                <Form>
                  <VStack spacing='8px' alignItems='flex-start'>
                    <InputField
                      type='text'
                      name='bankName'
                      placeholder='Bank name'
                      label='Bank name'
                      required
                    />

                    <InputField
                      type='text'
                      name='bankLocation'
                      placeholder='Bank Location'
                      label='Bank Location'
                      required
                    />
                    <InputField
                      type='text'
                      name='acctNumber'
                      placeholder='Account number'
                      label='Account number'
                      required
                    />
                    <Button mb='8px' colorScheme='teal' type='submit'>
                      Add
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAdOpen} onClose={onAdClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ streetAddr: '', city: '' }}
              onSubmit={(values) => {
                setAddress([values, ...address]);
                onAdClose();
              }}
            >
              {() => (
                <Form>
                  <VStack spacing='8px' alignItems='flex-start'>
                    <InputField
                      type='text'
                      name='streetAddr'
                      placeholder='Street address'
                      label='Street address'
                      required
                    />

                    <InputField
                      type='text'
                      name='city'
                      placeholder='city'
                      label='City'
                      required
                    />
                    <Button mb='8px' colorScheme='teal' type='submit'>
                      Add
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
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
