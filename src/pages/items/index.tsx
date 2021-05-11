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
import React, { useState } from 'react';
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
} from '../../constants';
import { useMutation, useQueryClient, QueryClient } from 'react-query';
import { client } from '../../utils/api-client';
import { truncate } from '../../utils/index';
import { FreezeCol, Sort, LimitField } from '../../components/Options';
import Filter from '../../components/Options/Filter';
import { TableCeil } from '../../components/styles/Table';
import ContentHeader from '../../components/ContentHeader';
import Link from 'next/link';
import { useItems, useDeleteItem } from '../../utils/items';
import { useMe } from '../../hooks/useMe';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { dehydrate } from 'react-query/hydration';
import { I_Item } from '../../types';
import { checkAuth } from '../../utils/checkAuth';
import { withSession } from '../../lib/withSession';

const FilterInput = () => (
  <VStack spacing='8px'>
    <InputField
      name='pricePerItemFrom'
      label='Price From'
      type='number'
      placeholder='$0'
    />
    <InputField
      name='pricePerItemTo'
      label='To'
      type='number'
      placeholder='$999'
    />
    <InputField
      name='createdAtFrom'
      label='Created at from'
      type='date'
      placeholder='created at'
    />
    <InputField
      name='createdAtTo'
      label='To'
      type='date'
      placeholder='created at to'
    />
    <FormControl>
      <FormLabel htmlFor='warehouse'>Warehouse</FormLabel>
      <Field
        as='select'
        placeholder='select option'
        style={SELECT_STYLE}
        id='warehouse'
        name='warehouse'
      >
        <option value=''>Select an option</option>
        <option value='60528fdd27ae2f0b7f0d843c'>UNIHAN 1909 LINH NG</option>
      </Field>
    </FormControl>
    <FormControl>
      <FormLabel htmlFor='warehouse'>Status</FormLabel>
      <Field
        as='select'
        placeholder='select option'
        style={SELECT_STYLE}
        name='status'
        id='status'
      >
        <option value=''>Select one option</option>
        <option value='not-yet-ordered'>Not Ordered Yet</option>
        <option value='ordered'>Ordered</option>
        <option value='on-the-way-to-warehouse'>On the way to Warehouse</option>
        <option value='on-the-way-to-viet-nam'>On the way to VN</option>
        <option value='arrived-at-viet-nam'>Arrived at VN</option>
        <option value='done'>Done</option>
        <option value='returning'>Returning</option>
        <option value='returned'>Returned</option>
      </Field>
    </FormControl>
    <FormControl>
      <FormLabel htmlFor='website'>Order website</FormLabel>
      <Field
        as='select'
        placeholder='select option'
        style={SELECT_STYLE}
        name='website'
        id='website'
      >
        <option value=''>Choose one</option>
        <option value='amazon'>Amazon</option>
        <option value='sephora'>Sephora</option>
        <option value='ebay'>Ebay</option>
        <option value='bestbuy'>Best buy</option>
        <option value='costco'>Costco</option>
        <option value='walmart'>Walmart</option>
        <option value='assisting'>Others</option>
      </Field>
    </FormControl>
  </VStack>
);

const LoadingLayout = () => (
  <>
    {Array.from({ length: 8 }).map((_item, i) => (
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
const Items = () => {
  const [freezeNo, setFreezeNo] = useState(4);
  const [selected, setSelected] = useState(ITEM_DEFAULT);
  const [sort, setSort] = useState('_id:desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [filter, setFilter] = useState('');
  const { status, data, error } = useItems(
    null,
    page,
    selected,
    sort,
    filter,
    limit
  );

  const queryClient = useQueryClient();

  const reloadPage = () => {
    queryClient.invalidateQueries(['items', page, selected, sort, filter]);
  };

  return (
    <>
      <Header title='Items' />
      <ContentHeader title='Items' />
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
          <Box display='flex' justifyContent='flex-end'>
            <HStack spacing={2} align='stretch'>
              <NextLink href='/items/new' passHref>
                <Button colorScheme='teal'>Add items +</Button>
              </NextLink>
              <FreezeCol freezeNo={freezeNo} setFreezeNo={setFreezeNo} />
              <Filter
                setFilter={setFilter}
                defaultValues={{
                  pricePerItemFrom: '',
                  pricePerItemTo: '',
                  createdAtFrom: '',
                  createdAtTo: '',
                  warehouse: '',
                  status: '',
                  website: '',
                  orderAccount: '',
                }}
              >
                <FilterInput />
              </Filter>
              <Sort
                sortable={[
                  '_id',
                  'createdAt',
                  'pricePerItem',
                  'updatedAt',
                  'orderDate',
                ]}
                setSort={setSort}
                map={ITEM_FIELD_MAP_2}
              />
              <LimitField
                selected={selected}
                setSelected={setSelected}
                fields={ITEM_FIELDS}
                defaults={ITEM_DEFAULT}
                map={ITEM_FIELD_MAP_2}
              />
            </HStack>
          </Box>
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
                          key={field}
                          index={index}
                          freezeNo={freezeNo}
                        >
                          {ITEM_FIELD_MAP[field as keyof I_Item]}
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
                        <ItemRow
                          single={single}
                          reloadPage={reloadPage}
                          selected={selected}
                          freezeNo={freezeNo}
                          key={single._id}
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
                disabled={page <= 1}
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
                    : page >= Math.ceil(data.data.totalCount / limit)
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

interface ItemRowProps {
  single: I_Item;
  reloadPage: () => void;
  selected: string[];
  freezeNo: number;
}

function ItemRow({ single, reloadPage, selected, freezeNo }: ItemRowProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  } = useDeleteItem({
    onSuccess: () => {
      reloadPage();
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
        reloadPage();
        onClose();
      },
    }
  );
  return (
    <Tr key={single._id}>
      {selected.map((field: string, index: number) => {
        const [output, fullStr] = truncate(
          single[field as keyof I_Item],
          16,
          ITEM_FIELD_MAP_2[field as keyof I_Item].type
        );
        if (index < freezeNo) {
          return (
            <Td
              position='sticky'
              maxW={200}
              minW={200}
              left={200 * index}
              backgroundColor='gray.50'
              key={field}
            >
              <Tooltip label={fullStr} aria-label='A tooltip'>
                <span>{output}</span>
              </Tooltip>
            </Td>
          );
        } else {
          return (
            <Td key={field}>
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
            <Link href={`/items/${single._id}/edit`} passHref>
              <MenuItem>Edit</MenuItem>
            </Link>
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
                          console.log(single._id);
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
            <>
              <MenuItem
                onClick={() => {
                  onOpen();
                }}
                isDisabled={!!single.actualCost}
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
                      id: single._id,
                    });
                    // onClose();
                  }}
                >
                  {(props) => (
                    <Form>
                      <ModalContent>
                        <ModalHeader>Choose accounts</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          {isChargeError && (
                            <Alert status='error'>
                              <AlertIcon />
                              <AlertTitle mr={2}>
                                {(chargeError as Error).message}
                              </AlertTitle>
                            </Alert>
                          )}
                          <FormControl>
                            <FormLabel htmlFor={`accountId-${single._id}`}>
                              Account
                            </FormLabel>
                            <Select
                              placeholder='Select option'
                              id={`accountId-${single._id}`}
                              name='accountId'
                              value={props.values.accountId}
                              onChange={(e) =>
                                props.setFieldValue('accountId', e.target.value)
                              }
                              required
                            >
                              {ACCOUNTS.filter(
                                (account) => account.website === single.website
                              ).map((account) => (
                                <option value={account._id} key={account._id}>
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
                            onClick={() => console.log('qwe')}
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
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req, res }: GetServerSidePropsContext) {
    return checkAuth(req);
  }
);

export default Items;
