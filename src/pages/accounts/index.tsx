import { Button, IconButton } from '@chakra-ui/button';
import { Box, HStack } from '@chakra-ui/layout';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import ContentHeader from '../../components/ContentHeader';
import Header from '../../components/Header';
import ContentBody from '../../components/styles/ContentBody';
import { BASE_URL } from '../../constants';
import { client } from '../../utils/api-client';
import { ACCOUNT_FIELDS, ACCOUNT_FIELD_MAP } from '../../constants';
import { truncate } from '../../utils';
import { Tooltip } from '@chakra-ui/tooltip';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { RiMoreFill } from 'react-icons/ri';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Alert,
  AlertIcon,
  AlertTitle,
  ModalFooter,
  useDisclosure,
  Skeleton,
  Icon,
} from '@chakra-ui/react';

import NextLink from 'next/link';
import { Sort } from '../../components/Options';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { useMe } from '../../hooks/useMe';

export default function AccountPage() {
  const [sort, setSort] = useState('_id:desc');
  const [page, setPage] = useState(1);
  const [fieldName, fieldOrder] = sort.split(':');
  const queryClient = useQueryClient();

  const { user, isLoading: isUserLoading, status: userStatus } = useMe();

  const { data, status, error } = useQuery(['accounts', sort, page], () =>
    client(
      `${BASE_URL}/accounts?page=${page}&sort=${
        fieldOrder === 'desc' ? '-' : ''
      }${fieldName}`
    )
  );

  const LoadingLayout = () => (
    <>
      {Array.from({ length: 8 }).map((_item, i) => (
        <Tr height='57px' key={i}>
          {ACCOUNT_FIELDS.map((field, index) => {
            return (
              <Td key={index}>
                <Skeleton height='16px' />
              </Td>
            );
          })}
          <Td
            right={0}
            position='sticky'
            maxW='100px'
            minW='100px'
            bg='gray.50'
          >
            <Icon as={IconButton} />
          </Td>
        </Tr>
      ))}
    </>
  );

  const reloadPage = () => {
    queryClient.invalidateQueries(['accounts', sort, page]);
  };

  return (
    <>
      <Header title='Accounts' />
      <ContentHeader
        title='Accounts'
        user={user}
        isLoading={isUserLoading}
        status={userStatus}
      />
      <ContentBody>
        <Box>
          <HStack justifyContent='flex-end' spacing={8}>
            <NextLink href='/accounts/new' passHref>
              <Button colorScheme='teal'>Add account +</Button>
            </NextLink>
            <Sort
              setSort={setSort}
              map={ACCOUNT_FIELD_MAP}
              sortable={['_id', 'createdAt', 'balance']}
            />
          </HStack>
          <Box marginTop={8} w='100%'>
            <Box fontSize='14px' whiteSpace='nowrap'>
              <Table>
                <Thead>
                  <Tr>
                    {ACCOUNT_FIELDS.map((field) => {
                      return (
                        <Th
                          key={field}
                          textTransform='capitalize'
                          bg='gray.300'
                        >
                          {ACCOUNT_FIELD_MAP[field].full}
                        </Th>
                      );
                    })}
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
                        <AcctRow
                          single={single}
                          key={single._id}
                          reloadPage={reloadPage}
                        />
                      ))}
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
                  : Math.ceil(data.data.totalCount / 8)}
              </p>
              <Button
                colorScheme='teal'
                disabled={
                  status === 'loading'
                    ? false
                    : page === Math.ceil(data.data.totalCount / 8)
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </HStack>
          </Box>
        </Box>
      </ContentBody>
    </>
  );
}

function AcctRow({ single, reloadPage }) {
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
      client(`${BASE_URL}/accounts/${data}`, {
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
      {ACCOUNT_FIELDS.map((field, index) => {
        const [output, fullStr] = truncate(
          single[field],
          16,
          ACCOUNT_FIELD_MAP[field].type
        );
        return (
          <Td key={index}>
            <Tooltip label={fullStr} aria-label='Tooltip'>
              <span>{output}</span>
            </Tooltip>
          </Td>
        );
      })}
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
                    <HStack spacing='8px'>
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
                    </HStack>
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
