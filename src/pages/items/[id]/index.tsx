import { Box, Grid, HStack, Text } from '@chakra-ui/layout';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import ContentBody from '../../../components/styles/ContentBody';
import { client } from '../../../utils/api-client';
import { useRouter } from 'next/router';
import {
  BASE_URL,
  ITEM_FIELDS,
  ITEM_FIELD_MAP_2,
  ACCOUNTS,
} from '../../../constants';
import { Form, Formik } from 'formik';
import { InputField } from '../../../components/InputField';
import { Button } from '@chakra-ui/button';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { removeBlankField, truncate } from '../../../utils';
import { I_Item } from '../../../types';
import { checkAuth } from '../../../utils/checkAuth';
import { withSession } from '../../../lib/withSession';
import { LoadingLayout } from '../../../components/LoadingLayout';
import { Tooltip } from '@chakra-ui/tooltip';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Modal,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Select } from '@chakra-ui/select';

export default function EditItem({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { status, data, error } = useQuery(['item', id], () =>
    client(`${BASE_URL}/items/${id}`)
  );

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
  } = useMutation(
    (data: string) =>
      client(`${BASE_URL}/items/${data}`, {
        method: 'DELETE',
        credentials: 'include',
      }),
    {
      onSuccess: () => {
        router.push('/items');
        onClose2();
      },
    }
  );

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
        queryClient.invalidateQueries(['item', id]);
        onClose();
      },
    }
  );

  const itemDetail = status === 'success' && data.data.data;
  return (
    <>
      <Header title='Item Details' />
      <ContentHeader title='Item Details' />
      <ContentBody>
        <Box width='100%'>
          {status === 'loading' ? (
            <LoadingLayout noOfLines={20} />
          ) : status === 'error' ? (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>{(error as Error).message}</AlertTitle>
            </Alert>
          ) : (
            <Box w='100%'>
              <HStack spacing='16px' mb='16px' justifyContent='center'>
                <>
                  <Button
                    colorScheme='red'
                    onClick={() => {
                      onOpen2();
                    }}
                  >
                    Delete
                  </Button>
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
                              deleteItem(id);
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
                  <Button
                    colorScheme='teal'
                    onClick={() => {
                      onOpen();
                    }}
                    isDisabled={!!itemDetail.actualCost}
                  >
                    Charge
                  </Button>
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
                          id: id,
                        });
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
                                <FormLabel htmlFor={`accountId-${id}`}>
                                  Account
                                </FormLabel>
                                <Select
                                  placeholder='Select option'
                                  id={`accountId-${id}`}
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
                                      account.website === itemDetail.website
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
              </HStack>
              <Grid gridTemplateColumns='repeat(3, 1fr)' gridRowGap='16px'>
                {ITEM_FIELDS.map((field) => {
                  const [output, fullStr] = truncate(
                    itemDetail[field as keyof I_Item],
                    24,
                    ITEM_FIELD_MAP_2[field as keyof I_Item].type
                  );
                  return (
                    <Box>
                      <Title>
                        {ITEM_FIELD_MAP_2[field as keyof I_Item].full}
                      </Title>
                      <TextDetail>
                        <Tooltip label={fullStr} aria-label='A tooltip'>
                          <span>{output}</span>
                        </Tooltip>
                      </TextDetail>
                    </Box>
                  );
                })}
                <Box>
                  <Title>Created At</Title>
                  <TextDetail>{itemDetail.createdAt}</TextDetail>
                </Box>
              </Grid>
            </Box>
          )}
        </Box>
      </ContentBody>
    </>
  );
}

function Title({ children }: { children: any }) {
  return (
    <Text
      fontSize='20px'
      color='gray.500'
      textTransform='capitalize'
      fontWeight='bold'
    >
      {children}
    </Text>
  );
}

function TextDetail({ children }: { children: any }) {
  return (
    <Text fontSize='16px' color='gray.600'>
      {children}
    </Text>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req, params }: GetServerSidePropsContext) {
    return checkAuth(req, { id: params!.id });
  }
);
