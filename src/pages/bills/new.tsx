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
  VStack,
  Text,
  Link,
  List,
  ListIcon,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  HStack,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  IconButton,
  ModalHeader,
  ModalOverlay,
  Input,
} from '@chakra-ui/react';
import { InputField } from '../../components/InputField';
import { client } from '../../utils/api-client';
import { useMutation, useQuery, QueryClient } from 'react-query';
import { BASE_URL } from '../../constants';
import { useRouter } from 'next/router';
import { BiCheckCircle } from 'react-icons/bi';
import NextLink from 'next/link';
import { Formik, Form, Field, FieldInputProps } from 'formik';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../hooks/useMe';
import { removeBlankField } from '../../utils';
import { MoneyType } from '../../types';
import { AiOutlineClose } from 'react-icons/ai';

interface Item_Interface {
  _id: string;
  name: string;
  pricePerItem: string;
  quantity: number;
}

interface I_Field {
  field: FieldInputProps<any>;
}

interface I_User_Br {
  _id: string;
  firstName: string;
  lastName?: string;
  role: string;
}

export interface I_Bill_Form {
  usdVndRate: number;
  shippingRateToVn: MoneyType;
  customTax?: number;
  notes?: string;
  customer: string;
  items: string[];
  affiliate: string;
}

interface I_Item_Form {
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

export default function NewBill() {
  const router = useRouter();
  const { user, isLoading: isUserLoading, status: currentUserStatus } = useMe();
  const [items, setItems] = React.useState<Item_Interface[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    setItems(
      JSON.parse(localStorage?.getItem('items-in-current-bill') || '[]')
    );
  }, []);

  const { mutate, isLoading, isError, error, isSuccess, reset } = useMutation(
    (data: I_Item_Form) =>
      client(`${BASE_URL}/items`, {
        method: 'POST',
        body: JSON.stringify(removeBlankField(data)),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSuccess: (data) => {
        const newItem = {
          _id: data.data.data._id,
          name: data.data.data.name,
          pricePerItem: data.data.data.pricePerItem,
          quantity: data.data.data.quantity,
        };
        //TODO: load items from localStorage
        localStorage.setItem(
          'items-in-current-bill',
          JSON.stringify([...items, newItem])
        );
        setItems([...items, newItem]);
        onClose();
      },
    }
  );
  const {
    mutate: createBill,
    isLoading: isBillLoading,
    isError: isBillError,
    error: billError,
    isSuccess: isBillSuccess,
  } = useMutation(
    (data: I_Bill_Form) =>
      client(`${BASE_URL}/bills`, {
        method: 'POST',
        body: JSON.stringify(removeBlankField(data)),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        router.push('/bills');
        localStorage.removeItem('items-in-current-bill');
      },
    }
  );

  const { data: users, status: userStatus, error: userError } = useQuery(
    ['users'],
    () => client(`${BASE_URL}/users?fields=_id,firstName,lastName,role`)
  );

  return (
    <>
      <Header title='Create a new bill' />
      <ContentHeader
        title='Create a new bill'
        user={user}
        isLoading={isUserLoading}
        status={currentUserStatus}
      />
      <ContentBody>
        <Box maxW='1080px' width='100%'>
          {router.query.customer !== undefined && (
            <Formik
              initialValues={{
                notes: '',
                customer: router.query.customer.toString(),
                usdVndRate: 24000,
                shippingRateToVn: {
                  value: 12,
                  currency: 'usd',
                },
                customTax: 8.75,
                affiliate: '',
              }}
              onSubmit={(values) => {
                createBill({
                  ...values,
                  items: items.map((item) => item._id),
                  customTax: values.customTax / 100,
                });
              }}
            >
              {() => (
                <Form>
                  {isBillError && (
                    <Alert status='error' mb='16px'>
                      <AlertIcon />
                      <AlertTitle mr={2}>
                        {(billError as Error).message}
                      </AlertTitle>
                    </Alert>
                  )}
                  {userStatus === 'error' && (
                    <Alert status='error'>
                      <AlertIcon />
                      <AlertTitle>{(userError as Error).message}</AlertTitle>
                    </Alert>
                  )}
                  {isBillSuccess && (
                    <Alert status='success'>
                      <AlertIcon />
                      <AlertTitle mr={2}>
                        Bill created! Redirecting...
                      </AlertTitle>
                    </Alert>
                  )}
                  <Grid
                    gridTemplateColumns='repeat(2, 1fr)'
                    gridGap='24px'
                    gridColumnGap='72px'
                    mb='24px'
                  >
                    <VStack alignItems='flex-start' justify='flex-start'>
                      <Text fontWeight='medium'>Items</Text>
                      {items.length > 0 ? (
                        <Popover>
                          <PopoverTrigger>
                            <Button>Click here for item lists</Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Item list</PopoverHeader>
                            <PopoverBody>
                              <List spacing={3}>
                                {items.map((item) => (
                                  <HStack
                                    justifyContent='space-between'
                                    key={item._id}
                                  >
                                    <NextLink
                                      href={`/items/${item._id}`}
                                      passHref
                                    >
                                      <Link>
                                        <ListItem>
                                          <ListIcon
                                            as={BiCheckCircle}
                                            color='green.500'
                                          />
                                          {`(${item.name} - ${item.pricePerItem}) x ${item.quantity}`}
                                        </ListItem>
                                      </Link>
                                    </NextLink>
                                    <IconButton
                                      icon={<AiOutlineClose />}
                                      colorScheme='red'
                                      aria-label='delete item'
                                      size='xs'
                                      variant='outline'
                                      borderRadius='50%'
                                      onClick={() => {
                                        setItems((items) =>
                                          items.filter(
                                            (single) => single._id !== item._id
                                          )
                                        );
                                        localStorage.setItem(
                                          'items-in-current-bill',
                                          JSON.stringify(items)
                                        );
                                      }}
                                    />
                                  </HStack>
                                ))}
                              </List>
                            </PopoverBody>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Text>Nothing here. Please add item</Text>
                      )}
                    </VStack>
                    <Field name='customer'>
                      {({ field }: I_Field) => (
                        <FormControl>
                          <FormLabel htmlFor='customer'>Customer</FormLabel>
                          <Select id='customer' required {...field}>
                            {userStatus === 'loading' ? (
                              <option value=''>Loading</option>
                            ) : (
                              <>
                                <option value=''>Select one</option>
                                {users.data.data.map((user: I_User_Br) => (
                                  <option
                                    value={user._id}
                                    key={user._id}
                                  >{`${user.firstName} ${user.lastName} - ${user.role}`}</option>
                                ))}
                              </>
                            )}
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    <InputField
                      type='number'
                      name='usdVndRate'
                      placeholder='USD / VND rate'
                      label='USD / VND rate'
                      required
                    />
                    <HStack alignItems='flex-end'>
                      <Field name='shippingRateToVn.value'>
                        {({ field }: I_Field) => (
                          <FormControl>
                            <FormLabel htmlFor='shippingRateToVn'>
                              Shipping rate to VN
                            </FormLabel>
                            <Input
                              {...field}
                              id='shippingRateToVn'
                              placeholder='Shipping Rate to VN'
                              type='number'
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name='shippingRateToVn.currency'>
                        {({ field }: I_Field) => (
                          <Select
                            {...field}
                            id='shippingRateToVnCurrency'
                            required
                            flexShrink={3}
                          >
                            <option value=''>Select one</option>
                            <option value='usd'>USD</option>
                            <option value='vnd'>VND</option>
                          </Select>
                        )}
                      </Field>
                    </HStack>
                    <Field name='affiliate'>
                      {({ field }: I_Field) => (
                        <FormControl>
                          <FormLabel htmlFor='affiliate'>Affiliate</FormLabel>
                          <Select id='affiliate' required {...field}>
                            {userStatus === 'loading' ? (
                              <option value=''>Loading</option>
                            ) : (
                              <>
                                <option value=''>Select one</option>
                                {users.data.data.map((user: I_User_Br) => (
                                  <option
                                    value={user._id}
                                    key={user._id}
                                  >{`${user.firstName} ${user.lastName} - ${user.role}`}</option>
                                ))}
                              </>
                            )}
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                    <InputField
                      type='number'
                      name='customTax'
                      placeholder='Tax for customer'
                      label='Tax for customer'
                      max={100}
                      min={0}
                      step={0.25}
                      required
                    />
                    <InputField
                      type='text'
                      name='notes'
                      placeholder='notes'
                      label='notes'
                      textarea
                    />
                  </Grid>
                  <HStack spacing={6}>
                    <>
                      <Button
                        onClick={() => {
                          onOpen();
                          reset();
                        }}
                        isLoading={isLoading}
                      >
                        Add new Item
                      </Button>
                      <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                        isCentered
                        size='3xl'
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Add new item</ModalHeader>
                          <ModalCloseButton></ModalCloseButton>
                          <ModalBody>
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
                                onSubmit={(values: I_Item_Form) => {
                                  mutate(values);
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
                                          Item created!
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
                                      <Field name='website'>
                                        {({ field }: I_Field) => (
                                          <FormControl>
                                            <FormLabel htmlFor='website'>
                                              Order Website
                                            </FormLabel>
                                            <Select
                                              {...field}
                                              id='website'
                                              required
                                            >
                                              <option value=''>
                                                Select one
                                              </option>
                                              <option value='amazon'>
                                                Amazon
                                              </option>
                                              <option value='sephora'>
                                                Sephora
                                              </option>
                                              <option value='bestbuy'>
                                                Bestbuy
                                              </option>
                                              <option value='costco'>
                                                Costco
                                              </option>
                                              <option value='target'>
                                                Target
                                              </option>
                                              <option value='walmart'>
                                                Walmart
                                              </option>
                                              <option value='others'>
                                                Others
                                              </option>
                                            </Select>
                                          </FormControl>
                                        )}
                                      </Field>
                                      <Field name='itemType'>
                                        {({ field }: I_Field) => (
                                          <FormControl>
                                            <FormLabel htmlFor='itemType'>
                                              Item Type
                                            </FormLabel>
                                            <Select
                                              {...field}
                                              placeholder='Select option'
                                              id='itemType'
                                              required
                                            >
                                              <option value='cosmetics'>
                                                cosmetics
                                              </option>
                                              <option value='toys'>toys</option>
                                              <option value='electronics'>
                                                electronics
                                              </option>
                                              <option value='accessories'>
                                                accessories
                                              </option>
                                              <option value='others'>
                                                others
                                              </option>
                                            </Select>
                                          </FormControl>
                                        )}
                                      </Field>
                                      <Field name='warehouse'>
                                        {({ field }: I_Field) => (
                                          <FormControl>
                                            <FormLabel htmlFor='warehouse'>
                                              Warehouse
                                            </FormLabel>
                                            <Select
                                              {...field}
                                              placeholder='Select option'
                                              id='warehouse'
                                              required
                                            >
                                              <option value=''>
                                                Select option
                                              </option>
                                              <option value='60528fdd27ae2f0b7f0d843c'>
                                                UNIHAN
                                              </option>
                                            </Select>
                                          </FormControl>
                                        )}
                                      </Field>
                                      <InputField
                                        type='text'
                                        name='notes'
                                        placeholder='Notes'
                                        label='Notes'
                                      />
                                    </Grid>
                                    <HStack spacing={6} mb='16px'>
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
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </>
                    <Button
                      type='submit'
                      colorScheme='teal'
                      isLoading={isBillLoading}
                    >
                      Submit
                    </Button>
                  </HStack>
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
