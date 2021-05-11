import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  IconButton,
  Link,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  Td,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import NextLink from 'next/link';
import { RiMoreFill } from 'react-icons/ri';
import { Form, Formik } from 'formik';
import { InputField } from './InputField';
import { useMutation } from 'react-query';
import { client } from '../utils/api-client';
import { BASE_URL } from '../constants';
import { I_Bill } from '../types';

interface I_Bill_Row {
  single: I_Bill;
  reloadPage: () => void;
}

export default function BillRow({ single, reloadPage }: I_Bill_Row) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentItem = React.useRef<string>();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const {
    mutate: pay,
    error: payError,
    isError: isPayError,
    isLoading: isPayLoading,
    reset: payReset,
  } = useMutation(
    (data: { amount: number | string }) =>
      client(`${BASE_URL}/bills/${currentItem.current}/pay`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }),

    {
      onSuccess: () => {
        reloadPage();
        onClose();
      },
    }
  );
  const {
    mutate: deleteItem,
    isLoading: isDeleteLoading,
    reset: resetDelete,
  } = useMutation(
    (data?: string) =>
      client(`${BASE_URL}/bills/${data}`, {
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
    <>
      <Tr key={single._id}>
        <Td>
          <Tooltip label={single._id} aria-label='Tooltop'>
            <span>
              <NextLink href={`/bills/${single._id}`}>
                {single._id.slice(0, 16) + '...'}
              </NextLink>
            </span>
          </Tooltip>
        </Td>
        <Td>{single.createdAt}</Td>
        <Td>
          <Popover>
            <PopoverTrigger>
              <Button size='xs'>Item details</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Item list</PopoverHeader>
              <PopoverBody>
                <List spacing={3}>
                  {single.items.map((item: any, index: number) => (
                    <NextLink href={`/items/${item._id}`} passHref key={index}>
                      <Link>
                        <ListItem>
                          <ListIcon as={BiCheckCircle} color='green.500' />
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
          <NextLink href={`/users/${single.customer._id}`}>
            {`${single.customer.firstName} ${single.customer.lastName}`}
          </NextLink>
        </Td>
        <Td>
          <NextLink href={`/users/${single.affiliate._id}`}>
            {`${single.affiliate.firstName} ${single.affiliate.lastName}`}
          </NextLink>
        </Td>
        <Td>
          <Tag
            variant='outline'
            colorScheme={
              single.status === 'partially-paid'
                ? 'blue'
                : single.status === 'not-paid'
                ? 'red'
                : 'gray'
            }
          >
            {single.status}
          </Tag>
        </Td>
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
              <NextLink href={`/bills/${single._id}`} passHref>
                <MenuItem>View details</MenuItem>
              </NextLink>
              <NextLink href={`/bills/${single._id}/edit`} passHref>
                <MenuItem>Edit</MenuItem>
              </NextLink>
              <>
                <MenuItem
                  onClick={() => {
                    onOpen();
                    currentItem.current = single._id;
                  }}
                  isDisabled={single.status === 'fully-paid'}
                >
                  Pay
                </MenuItem>
              </>
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
                      <Button onClick={onClose2}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            </MenuList>
          </Menu>
          <Modal
            isOpen={isOpen}
            onClose={() => {
              onClose();
              payReset();
            }}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <Formik
                initialValues={{
                  amount: single.actCharge
                    ? parseFloat(
                        single.actCharge.toString().slice(1).split(',').join('')
                      )
                    : '',
                }}
                onSubmit={(values) => pay(values)}
              >
                {() => (
                  <Form>
                    <ModalHeader>Pay</ModalHeader>
                    <ModalBody>
                      {isPayError && (
                        <Alert status='error' mb='16px'>
                          <AlertIcon />
                          <AlertTitle mr={2}>
                            {(payError as Error).message}
                          </AlertTitle>
                        </Alert>
                      )}
                      <InputField
                        type='number'
                        name='amount'
                        placeholder='Amount'
                        label='Amount'
                        required
                      />
                    </ModalBody>
                    <ModalFooter>
                      <HStack spacing={2}>
                        <Button
                          isLoading={isPayLoading}
                          colorScheme='teal'
                          type='submit'
                        >
                          Submit
                        </Button>
                      </HStack>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            </ModalContent>
          </Modal>
        </Td>
      </Tr>
    </>
  );
}
