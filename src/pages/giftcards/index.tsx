import {
  Box,
  Button,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import React, { useState, useRef } from 'react';
import { RiMoreFill } from 'react-icons/ri';
import Header from '../../components/Header';
import { InputField } from '../../components/InputField';
import NextLink from 'next/link';
import {
  BASE_URL,
  ITEM_FIELD_MAP,
  ITEM_DEFAULT,
  ITEM_FIELD_MAP_2,
  ITEM_FIELDS,
  SELECT_STYLE,
  ACCOUNTS,
  CRYPTO_DEFAULT,
  CRYPTO_FIELD_MAP,
  CRYPTO_FIELDS,
  GIFT_CARD_DEFAULT,
  GIFT_CARD_MAP,
  GIFT_CARD_FIELDS,
} from '../../constants';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { client } from '../../utils/api-client';
import { truncate } from '../../utils/index';
import { FreezeCol, Sort, LimitField } from '../../components/Options';
import Filter from '../../components/Options/Filter';
import { TableCeil } from '../../components/styles/Table';
import ContentHeader from '../../components/ContentHeader';
import Link from 'next/link';
import { useItems, useDeleteItem } from '../../utils/items';
export interface I_Item {
  _id: string;
  createdAt: string;
  name: string;
  link: string;
  pricePerItem: string;
  actPricePerItem: string;
  quantity: string;
  tax: string;
  usShippingFee: string;
  extraShippingCost: string;
  estWgtPerItem: string;
  actWgtPerItem: string;
  actualCost: string;
  trackingLink: string;
  invoiceLink: string;
  orderDate: string;
  arrvlAtWarehouseDate: string;
  customerRcvDate: string;
  returnDate: string;
  returnArrvlDate: string;
  notes: string;
  status: string;
  website: string;
  commissionRate: string;
  itemType: string;
  orderAccount: string;
  warehouse: string;
  transaction: string;
  updatedAt: string;
}

const layout = Array.from({ length: 8 });

const LoadingLayout = () => (
  <>
    {layout.map((_item, i) => (
      <Tr height='57px' key={i}>
        {ITEM_DEFAULT.map((field, index) => {
          return (
            <Td key={index}>
              <Skeleton height='16px' />
            </Td>
          );
        })}
        <Td right={0} position='sticky' maxW='100px' minW='100px' bg='gray.50'>
          <Icon as={IconButton} />
        </Td>
      </Tr>
    ))}
  </>
);
const Cryptos = () => {
  const [freezeNo, setFreezeNo] = useState(4);
  const [selected, setSelected] = useState(GIFT_CARD_DEFAULT);
  const [sort, setSort] = useState('_id:desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [filter, setFilter] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const currentItem = useRef('');
  const [fieldName, fieldOrder] = sort.split(':');
  const { status, data, error } = useQuery(
    ['giftcards', page, selected, sort, filter, limit],
    () =>
      client(
        `${BASE_URL}/giftcards?page=${page}&limit=${limit}&fields=${selected}&sort=${
          fieldOrder === 'desc' ? '-' : ''
        }${fieldName} ${filter && `&${filter}`}`
      )
  );
  // const { status, data, error } = useQuery(
  //   ["items", page, selected, sort, filter],
  //   () =>
  //     client(
  //       `${BASE_URL}/items?page=${page}&limit=${limit}&fields=${selected}&sort=${
  //         fieldOrder === "desc" ? "-" : ""
  //       }${fieldName}${filter && `&${filter}`}`
  //     )
  // );

  const queryClient = useQueryClient();

  const {
    mutate: deleteItem,
    error: deleteError,
    isError: isDeleteError,
    isLoading: isDeleteLoading,
    reset: resetDelete,
  } = useDeleteItem({
    onSuccess: () => {
      queryClient.invalidateQueries(['items', page, selected, sort, filter]);
      onClose2();
    },
  });

  const {
    mutate: charge,
    error: chargeError,
    isError: isChargeError,
    isLoading: isChargeLoading,
    reset: resetCharge,
  } = useMutation(
    (data: { id: string; accountId: string }) =>
      client(`${BASE_URL}/items/${data.id}/${data.accountId}`, {
        method: 'PATCH',
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['items', page, selected, sort, filter]);
        onClose();
      },
    }
  );
  return (
    <>
      <Header title='Giftcards' />
      <ContentHeader title='Giftcards' />
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
        <Box>
          <HStack spacing={2} justifyContent='flex-end'>
            <NextLink href='/giftcards/new' passHref>
              <Button colorScheme='teal'>Add giftcards +</Button>
            </NextLink>
            <FreezeCol freezeNo={freezeNo} setFreezeNo={setFreezeNo} />
            <Sort
              sortable={['_id', 'createdAt']}
              setSort={setSort}
              map={GIFT_CARD_MAP}
            />
            <LimitField
              selected={selected}
              setSelected={setSelected}
              fields={GIFT_CARD_FIELDS}
              defaults={GIFT_CARD_DEFAULT}
              map={GIFT_CARD_MAP}
            />
          </HStack>
          {/* {status === "loading" ? (
            <Spinner position="absolute" top="50%" left="50%" />
          ) : status === "error" ? (
            <span>{(error as Error).message}</span>
          ) : ( */}
          <Box marginTop={8} w='100%'>
            <Box
              position='relative'
              overflow={`${selected.length > 8 ? 'auto' : 'hidden'} hidden`}
              whiteSpace='nowrap'
              minH='500px'
              fontSize='14px'
            >
              <Table>
                <Thead>
                  <Tr>
                    {selected.map((field, index) => {
                      return (
                        <TableCeil
                          key={index}
                          index={index}
                          freezeNo={freezeNo}
                        >
                          {GIFT_CARD_MAP[field].full}
                        </TableCeil>
                      );
                    })}
                    <Th
                      right={0}
                      position='sticky'
                      maxW='100px'
                      minW='100px'
                      backgroundColor='gray.300'
                      borderTopRightRadius={6}
                      borderBottomRightRadius={6}
                      textTransform='capitalize'
                    >
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {status === 'loading' ? (
                    <LoadingLayout />
                  ) : status === 'error' ? (
                    <span>{(error as Error).message}</span>
                  ) : (
                    <>
                      {data.data.data.map((single: I_Item) => (
                        <Tr key={single._id}>
                          {selected.map((field, index) => {
                            const [output, fullStr] = truncate(
                              single[field],
                              16,
                              GIFT_CARD_MAP[field].type
                            );
                            if (index < freezeNo) {
                              return (
                                <Td
                                  position='sticky'
                                  maxW={200}
                                  minW={200}
                                  left={200 * index}
                                  backgroundColor='gray.50'
                                  key={index}
                                >
                                  <Tooltip
                                    label={fullStr}
                                    aria-label='A tooltip'
                                  >
                                    <span>{output}</span>
                                  </Tooltip>
                                </Td>
                              );
                            } else {
                              return <Td key={index}>{output}</Td>;
                            }
                          })}
                          <Td
                            right={0}
                            position='sticky'
                            maxW='100px'
                            minW='100px'
                            textTransform='capitalize'
                            bg='gray.50'
                            _hover={{ zIndex: 1 }}
                          >
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                aria-label='More options'
                                icon={<RiMoreFill />}
                                variant='outline'
                                size='xs'
                                borderRadius='50%'
                              />
                              <MenuList>
                                <Link
                                  href={`/items/${single._id}/edit`}
                                  passHref
                                >
                                  <MenuItem>Edit</MenuItem>
                                </Link>
                                <>
                                  <MenuItem
                                    onClick={() => {
                                      currentItem.current = single._id;
                                      onOpen2();
                                    }}
                                  >
                                    Delete
                                  </MenuItem>
                                  <Modal
                                    isOpen={isOpen2}
                                    onClose={() => {
                                      onClose2();
                                      resetDelete();
                                    }}
                                    isCentered
                                  >
                                    <ModalOverlay />
                                    <ModalContent>
                                      <ModalHeader>Alert</ModalHeader>
                                      <ModalCloseButton />
                                      <ModalBody>
                                        {isDeleteError && (
                                          <Alert status='error'>
                                            <AlertIcon />
                                            <AlertTitle>
                                              {(deleteError as Error).message}
                                            </AlertTitle>
                                          </Alert>
                                        )}
                                        <p>Are you sure you want to delete?</p>
                                      </ModalBody>
                                      <ModalFooter>
                                        <Button
                                          isLoading={isDeleteLoading}
                                          colorScheme='red'
                                          onClick={() => {
                                            deleteItem(currentItem.current);
                                          }}
                                        >
                                          Delete
                                        </Button>
                                        <Button onClick={onClose2}>
                                          Cancel
                                        </Button>
                                      </ModalFooter>
                                    </ModalContent>
                                  </Modal>
                                </>
                                <>
                                  <MenuItem
                                    onClick={() => {
                                      currentItem.current = single._id;
                                      onOpen();
                                    }}
                                  >
                                    Charge
                                  </MenuItem>
                                  <Modal
                                    isOpen={isOpen}
                                    onClose={() => {
                                      onClose();
                                      resetCharge();
                                    }}
                                    isCentered
                                  >
                                    <ModalOverlay />
                                    <Formik
                                      initialValues={{ accountId: '' }}
                                      onSubmit={(values) => {
                                        charge({
                                          ...values,
                                          id: currentItem.current,
                                        });
                                        console.log(currentItem.current);
                                      }}
                                    >
                                      {(props) => (
                                        <Form>
                                          <ModalContent>
                                            <ModalHeader>
                                              Choose accounts
                                            </ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                              {isChargeError && (
                                                <Alert status='error'>
                                                  <AlertIcon />
                                                  <AlertTitle mr={2}>
                                                    {
                                                      (chargeError as Error)
                                                        .message
                                                    }
                                                  </AlertTitle>
                                                </Alert>
                                              )}
                                              <FormControl>
                                                <FormLabel
                                                  htmlFor={`accountId-${single._id}`}
                                                >
                                                  Account
                                                </FormLabel>
                                                <Select
                                                  placeholder='Select option'
                                                  id={`accountId-${single._id}`}
                                                  name='accountId'
                                                  value={props.values.accountId}
                                                  onChange={(e) =>
                                                    props.setFieldValue(
                                                      'accountId',
                                                      e.target.value
                                                    )
                                                  }
                                                  required
                                                >
                                                  {ACCOUNTS.filter(
                                                    (account) =>
                                                      account.website ===
                                                      single.website
                                                  ).map((account) => (
                                                    <option
                                                      value={account._id}
                                                      key={account._id}
                                                    >
                                                      {account.name}
                                                    </option>
                                                  ))}
                                                </Select>
                                              </FormControl>
                                            </ModalBody>
                                            <ModalFooter>
                                              <Button
                                                colorScheme='blue'
                                                type='submit'
                                                isLoading={isChargeLoading}
                                                onClick={() =>
                                                  console.log('qwe')
                                                }
                                              >
                                                Charge
                                              </Button>
                                            </ModalFooter>
                                          </ModalContent>
                                        </Form>
                                      )}
                                    </Formik>
                                  </Modal>
                                </>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                      {Array.from({ length: 8 - data.data.data.length }).map(
                        (item, i) => (
                          <Tr key={i} height='57px'>
                            {selected.map((field, index) => (
                              <Td></Td>
                            ))}
                            <Td
                              right={0}
                              position='sticky'
                              maxW='100px'
                              minw='100px'
                            />
                          </Tr>
                        )
                      )}
                    </>
                  )}
                </Tbody>
              </Table>
            </Box>

            <HStack alignItems='center' justifyContent='flex-end' mt='16px'>
              <Button
                disabled={page === 1}
                colorScheme='teal'
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <p>
                {page} of{' '}
                {status === 'loading'
                  ? 'X'
                  : Math.ceil(data.data.totalCount / limit)}
              </p>
              <Button
                colorScheme='teal'
                disabled={
                  status === 'loading'
                    ? false
                    : page === Math.ceil(data.data.totalCount / limit)
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </HStack>
          </Box>
          {/* )} */}
        </Box>
      </Box>
    </>
  );
};

export default Cryptos;
