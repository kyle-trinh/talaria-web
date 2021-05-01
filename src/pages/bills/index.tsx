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
  FormControl,
  Input,
  FormLabel,
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
import { Field, Form, Formik } from 'formik';
import { InputField } from '../../components/InputField';
import BillRow from '../../components/BillRow';
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

  const reloadPage = () =>
    queryClient.invalidateQueries(['bills', page, selected, sort, limit]);

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

  const {
    mutate: payBill,
    error: payError,
    isError: isPayError,
    isLoading: isPayLoading,
    reset: resetPay,
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
      <Header title='Bills' />
      <ContentHeader title='Bills' />
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
            <NextLink href='/bills/new' passHref>
              <Button colorScheme='teal'>Add Bills +</Button>
            </NextLink>
            <Sort
              sortable={['_id', 'createdAt']}
              setSort={setSort}
              map={USER_MAP}
            />
          </HStack>
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
                      Received
                    </Th>
                    <Th textTransform='capitalize' bg='gray.300'>
                      Total Bill
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
                        <BillRow
                          reloadPage={reloadPage}
                          key={single._id}
                          single={single}
                        />
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
