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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
} from '@chakra-ui/react';
import { InputField } from '../../components/InputField';
import { client } from '../../utils/api-client';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BASE_URL } from '../../constants';
import { Router, useRouter } from 'next/router';
import { BiCheckCircle } from 'react-icons/bi';
import NextLink from 'next/link';
// import dynamic from 'next/dynamic';
// const { Formik, Form, Field } = dynamic(() => import('formik'), { ssr: false });
import { Formik, Form, Field } from 'formik';

interface Item_Interface {
  _id: string;
  name: string;
  pricePerItem: string;
  quantity: number;
}

export default function NewBill() {
  const router = useRouter();
  console.log(router.query.customer);
  const queryClient = useQueryClient();
  const [items, setItems] = React.useState<Item_Interface[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, isLoading, isError, error, isSuccess, reset } = useMutation(
    (data: {
      commissionRate: number | null;
      estWgtPerItem: number;
      extraShippingCost: number;
      itemType: string;
      link: string;
      name: string;
      notes: string;
      pricePerItem: number;
      quantity: number;
      warehouse: string;
      website: string;
    }) =>
      client(`${BASE_URL}/items`, {
        method: 'POST',
        body: JSON.stringify(data),
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
        // localStorage.setItem('items-in-current-bill', JSON.stringify(newItem));
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
    (data: {
      notes: string;
      customer: string;
      usdVndRate: number;
      shippingRateToVn: {
        value: number;
        currency: string;
      };
      customTax: number;
      affiliate: string;
      items: string[];
    }) =>
      client(`${BASE_URL}/bills`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }),
    {
      onSuccess: (data) => {
        router.push('/bills');
      },
    }
  );

  const { data: users, status: userStatus, error: userError } = useQuery(
    ['users'],
    () =>
      client(
        `${BASE_URL}/users?role=customer&role=affiliate&fields=_id,firstName,lastName,role`
      )
  );

  return (
    <>
      <Header title='Create a new item' />
      <ContentHeader title='Create a new item' />
      <ContentBody>
        <Box maxW='1080px' width='100%'>
          {router.query.customer !== undefined && (
            <Formik
              initialValues={{
                notes: '',
                customer: router.query.customer,
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
              {(props) => (
                <Form>
                  {isBillError && (
                    <Alert status='error' mb='16px'>
                      <AlertIcon />
                      <AlertTitle mr={2}>
                        {(billError as Error).message}
                      </AlertTitle>
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
                      {({ field, form }) => (
                        <FormControl>
                          <FormLabel htmlFor='customer'>Customer</FormLabel>
                          <Select id='customer' required {...field}>
                            {userStatus === 'loading' ? (
                              <option value=''>Loading</option>
                            ) : (
                              <>
                                <option value=''>Select one</option>
                                {users.data.data
                                  .filter(
                                    (user) =>
                                      user.role === 'customer' ||
                                      user.role === 'affiliate'
                                  )
                                  .map((user) => (
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
                    />
                    <HStack alignItems='flex-end'>
                      <Field name='shippingRateToVn.value'>
                        {({ field, form }) => (
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
                        {({ field, form }) => (
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
                      {({ field, form }) => (
                        <FormControl>
                          <FormLabel htmlFor='affiliate'>Affiliate</FormLabel>
                          <Select id='affiliate' required {...field}>
                            {userStatus === 'loading' ? (
                              <option value=''>Loading</option>
                            ) : (
                              <>
                                <option value=''>Select one</option>
                                {users.data.data
                                  .filter((user) => user.role === 'affiliate')
                                  .map((user) => (
                                    <option
                                      value={user._id}
                                      key={user._id}
                                    >{`${user.firstName} ${user.lastName}`}</option>
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
                                  pricePerItem: 0,
                                  quantity: 1,
                                  estWgtPerItem: 0,
                                  website: 'amazon',
                                  itemType: 'toys',
                                  warehouse: '60528fdd27ae2f0b7f0d843c',
                                  commissionRate: 0,
                                  extraShippingCost: 0,
                                  notes: '',
                                }}
                                onSubmit={(values) => {
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
                                      <InputField
                                        type='number'
                                        name='estWgtPerItem'
                                        placeholder='Estimated weight'
                                        label='Estimated weight'
                                        required
                                      />
                                      <FormControl>
                                        <FormLabel htmlFor='website'>
                                          Order Website
                                        </FormLabel>
                                        <Select
                                          placeholder='Select option'
                                          id='website'
                                          name='website'
                                          value={props.values.website}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              'website',
                                              e.target.value
                                            )
                                          }
                                          required
                                        >
                                          <option value='amazon'>Amazon</option>
                                          <option value='sephora'>
                                            Sephora
                                          </option>
                                          <option value='bestbuy'>
                                            Bestbuy
                                          </option>
                                          <option value='costco'>Costco</option>
                                          <option value='target'>Target</option>
                                          <option value='walmart'>
                                            Walmart
                                          </option>
                                          <option value='others'>Others</option>
                                        </Select>
                                      </FormControl>
                                      <FormControl>
                                        <FormLabel htmlFor='itemType'>
                                          Item Type
                                        </FormLabel>
                                        <Select
                                          placeholder='Select option'
                                          id='itemType'
                                          name='itemType'
                                          value={props.values.itemType}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              'itemType',
                                              e.target.value
                                            )
                                          }
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
                                          <option value='others'>others</option>
                                        </Select>
                                      </FormControl>
                                      <FormControl>
                                        <FormLabel htmlFor='warehouse'>
                                          Warehouse
                                        </FormLabel>
                                        <Select
                                          placeholder='Select option'
                                          id='warehouse'
                                          name='warehouse'
                                          value={props.values.warehouse}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              'warehouse',
                                              e.target.value
                                            )
                                          }
                                          required
                                        >
                                          <option value='60528fdd27ae2f0b7f0d843c'>
                                            UNIHAN
                                          </option>
                                        </Select>
                                      </FormControl>
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
