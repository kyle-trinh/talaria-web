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
} from '@chakra-ui/react';
import React, { useState, useRef } from 'react';
import { RiMoreFill } from 'react-icons/ri';
import Header from '../../components/Header';
import NextLink from 'next/link';
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
import Link from 'next/link';
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
    ['affiliates', page, selected, sort, limit],
    () =>
      client(
        `${BASE_URL}/users?role=affiliate&page=${page}&limit=${limit}&sort=${
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
      client(`${BASE_URL}/users/${data}`, {
        method: 'DELETE',
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'affiliates',
          page,
          selected,
          sort,
          limit,
        ]);
        onClose2();
      },
    }
  );

  return (
    <>
      <Header title='Customers' />
      <ContentHeader title='Customers' />
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
            <NextLink href='/affiliates/new' passHref>
              <Button colorScheme='teal'>Add affiliates +</Button>
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
                      Created At
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Full Name
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Phone Number
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Email
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Birth Date
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Social Media
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
                                <Link href={`/customers/${single._id}`}>
                                  {single._id.slice(0, 16) + '...'}
                                </Link>
                              </span>
                            </Tooltip>
                          </Td>
                          <Td>{single.createdAt}</Td>
                          <Td>{`${single.firstName} ${single?.lastName}`}</Td>
                          <Td>
                            {single.profile.phoneNumbers.length > 0 &&
                              single.profile.phoneNumbers[0]}
                          </Td>
                          <Td>{single.email}</Td>
                          <Td>{single.profile.dob}</Td>
                          <Td>
                            {single.profile.socialMedias.length > 0 && (
                              <ExternalLink
                                href={`http://${single.profile.socialMedias[0].link}`}
                              >
                                {`${single.firstName} ${single.lastName}`}
                              </ExternalLink>
                            )}
                          </Td>
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
                                  href={`/affiliates/${single._id}/edit`}
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
