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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  ListItem,
  List,
  ListIcon,
  Link,
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { RiMoreFill } from 'react-icons/ri';
import Header from '../../components/Header';
import { BiCheckCircle } from 'react-icons/bi';
import {
  BASE_URL,
  ITEM_DEFAULT,
  GIFT_CARD_DEFAULT,
  USER_MAP,
} from '../../constants';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { client } from '../../utils/api-client';
import { Sort } from '../../components/Options';
import ContentHeader from '../../components/ContentHeader';
import NextLink from 'next/link';
import ExternalLink from '../../components/ExternalLink';
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
    ['bills', page, selected, sort, limit],
    () =>
      client(
        `${BASE_URL}/bills?page=${page}&limit=${limit}&sort=${
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
  } = useMutation(
    (data) =>
      client(`${BASE_URL}/bills/${data}`, {
        method: 'DELETE',
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bills', page, selected, sort, limit]);
        onClose2();
      },
    }
  );

  return (
    <>
      <Header title='Warehouses' />
      <ContentHeader title='Warehouses' />
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
            <NextLink href='/bill/new' passHref>
              <Button colorScheme='teal'>Add Bills +</Button>
            </NextLink>
            <Sort
              sortable={['_id', 'createdAt']}
              setSort={setSort}
              map={USER_MAP}
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
              overflow='auto hidden'
              whiteSpace='nowrap'
              minH='500px'
              fontSize='14px'
            >
              <Table>
                <Thead>
                  <Tr>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Id
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      createdAt
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Items
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Customer
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Affiliate
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Status
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Money received
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Total Bill VND
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Notes
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
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
                      {data.data.data.map((single) => (
                        <Tr key={single._id}>
                          <Td>
                            <Tooltip label={single._id} aria-label='Tooltop'>
                              <span>
                                <Link href={`/bills/${single._id}`}>
                                  {single._id.slice(0, 16) + '...'}
                                </Link>
                              </span>
                            </Tooltip>
                          </Td>
                          <Td>{single.createdAt}</Td>
                          <Td>
                            <Popover>
                              <PopoverTrigger>
                                <Button>Click here</Button>
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Item list</PopoverHeader>
                                <PopoverBody>
                                  <List spacing={3}>
                                    {single.items.map((item) => (
                                      <NextLink
                                        href={`/items/${single._id}`}
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
                          </Td>
                          <Td>
                            <NextLink
                              href={`/customers/${single.customer._id}`}
                            >
                              {`${single.customer.firstName} ${single.customer.lastName}`}
                            </NextLink>
                          </Td>
                          <Td>
                            <NextLink
                              href={`/affiliates/${single.affiliate._id}`}
                            >
                              {`${single.affiliate.firstName} ${single.affiliate.lastName}`}
                            </NextLink>
                          </Td>
                          <Td>{single.status}</Td>
                          <Td>{single.moneyReceived}</Td>
                          <Td>{single.actCharge}</Td>
                          <Td>{single.notes ? single.notes : '-'}</Td>
                          <Td>
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
                                  href={`/bills/${single._id}/edit`}
                                  passHref
                                >
                                  <MenuItem>Edit</MenuItem>
                                </Link>
                                <>
                                  <MenuItem
                                    onClick={() => {
                                      // mutate(single._id);
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
