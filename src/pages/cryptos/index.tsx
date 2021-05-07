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
import React, { useState } from 'react';
import { RiMoreFill } from 'react-icons/ri';
import Header from '../../components/Header';
import NextLink from 'next/link';
import {
  BASE_URL,
  ITEM_DEFAULT,
  CRYPTO_DEFAULT,
  CRYPTO_FIELD_MAP,
  CRYPTO_FIELDS,
} from '../../constants';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from 'react-query';
import { client } from '../../utils/api-client';
import { truncate } from '../../utils/index';
import { FreezeCol, Sort, LimitField } from '../../components/Options';
import { TableCeil } from '../../components/styles/Table';
import ContentHeader from '../../components/ContentHeader';
import Link from 'next/link';
import { I_Crypto } from '../../types';
import { useMe } from '../../hooks/useMe';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';

const layout = Array.from({ length: 8 });

const LoadingLayout = () => (
  <>
    {layout.map((_item, i) => (
      <Tr height='57px' key={i}>
        {ITEM_DEFAULT.map((_field, index) => {
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
  const { user, isLoading: isUserLoading, status: userStatus } = useMe();
  const [selected, setSelected] = useState(CRYPTO_DEFAULT);
  const [sort, setSort] = useState('_id:desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [fieldName, fieldOrder] = sort.split(':');
  const { status, data, error } = useQuery(
    ['cryptos', page, selected, sort, limit],
    () =>
      client(
        `${BASE_URL}/cryptos?page=${page}&limit=${limit}&fields=${selected}&sort=${
          fieldOrder === 'desc' ? '-' : ''
        }${fieldName}`
      )
  );

  const queryClient = useQueryClient();

  const reloadPage = () => {
    queryClient.invalidateQueries(['cryptos', page, selected, sort, limit]);
  };

  return (
    <>
      <Header title='Cryptos' />
      <ContentHeader
        title='Cryptos'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
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
        <Box>
          <HStack spacing={2} justifyContent='flex-end'>
            <NextLink href='/cryptos/new' passHref>
              <Button colorScheme='teal'>Add a crypto +</Button>
            </NextLink>
            <FreezeCol freezeNo={freezeNo} setFreezeNo={setFreezeNo} />
            <Sort
              sortable={['_id', 'createdAt']}
              setSort={setSort}
              map={CRYPTO_FIELD_MAP}
            />
            <LimitField
              selected={selected}
              setSelected={setSelected}
              fields={CRYPTO_FIELDS}
              defaults={CRYPTO_DEFAULT}
              map={CRYPTO_FIELD_MAP}
            />
          </HStack>
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
                          {CRYPTO_FIELD_MAP[field as keyof I_Crypto].full}
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
                    <Tr>
                      <Td>
                        <span>{(error as Error).message}</span>
                      </Td>
                    </Tr>
                  ) : (
                    <>
                      {data.data.data.map((single: I_Crypto) => (
                        <CryptoRow
                          key={single._id}
                          single={single}
                          selected={selected}
                          freezeNo={freezeNo}
                          reloadPage={reloadPage}
                        />
                      ))}
                      {Array.from({ length: 8 - data.data.data.length }).map(
                        (_item, i) => (
                          <Tr key={i} height='57px'>
                            {selected.map((_field, index) => (
                              <Td key={index}></Td>
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
              <p>Page {page}</p>
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
        </Box>
      </Box>
    </>
  );
};

interface I_Crypto_Row {
  single: I_Crypto;
  selected: string[];
  freezeNo: number;
  reloadPage: () => void;
}

function CryptoRow({ single, selected, freezeNo, reloadPage }: I_Crypto_Row) {
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    mutate: deleteItem,
    error: deleteError,
    isError: isDeleteError,
    isLoading: isDeleteLoading,
    reset: resetDelete,
  } = useMutation(
    (data: string) =>
      client(`${BASE_URL}/cryptos/${data}`, {
        method: 'DELETE',
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        reloadPage();
        onClose2();
      },
    }
  );
  return (
    <Tr key={single._id}>
      {selected.map((field: string, index: number) => {
        const [output, fullStr] = truncate(
          single[field as keyof I_Crypto],
          16,

          CRYPTO_FIELD_MAP[field as keyof I_Crypto].type
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
              <Tooltip label={fullStr} aria-label='A tooltip'>
                <span>{output}</span>
              </Tooltip>
            </Td>
          );
        } else {
          return (
            <Td key={index}>
              <Tooltip label={fullStr} aria-label='A tooltip'>
                <span>{output}</span>
              </Tooltip>
            </Td>
          );
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
            <>
              <MenuItem
                onClick={() => {
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
                        deleteItem(single._id);
                      }}
                    >
                      Delete
                    </Button>
                    <Button onClick={onClose2}>Cancel</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          </MenuList>
        </Menu>
      </Td>
    </Tr>
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
export default Cryptos;
