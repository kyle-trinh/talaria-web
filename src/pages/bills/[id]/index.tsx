import { Box, HStack, Text } from '@chakra-ui/layout';
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table';
import { useQuery } from 'react-query';
import ContentHeader from '../../../components/ContentHeader';
import Header from '../../../components/Header';
import { BASE_URL } from '../../../constants';
import { client } from '../../../utils/api-client';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { I_Item } from '../../../types';
import { checkAuth } from '../../../utils/checkAuth';
import { withSession } from '../../../lib/withSession';

export default function BillDetail({ id }: { id: string }) {
  const { status, data, error } = useQuery(['bill', id], () =>
    client(`${BASE_URL}/bills/${id}`)
  );

  return (
    <>
      <Header title='Bills details' />
      <ContentHeader title='Bill details' />
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
        <Box mt={8} w='100%'>
          {status === 'success' && data.data.data.items.length === 0 && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>No items existed for this bill</AlertTitle>
            </Alert>
          )}
          {status === 'loading' ? null : status === 'error' ? (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle>{(error as Error).message}</AlertTitle>
            </Alert>
          ) : (
            status === 'success' &&
            data.data.data.items.length >= 1 && (
              <>
                <Table>
                  <Thead>
                    <Tr color='var(--chakra-colors-gray-900)'>
                      <Th>Item name</Th>
                      <Th>Unit Price</Th>
                      <Th>Quantity</Th>
                      <Th>Unit Weight</Th>
                      <Th>US Shipping fee</Th>
                      <Th>Item total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {/* {status === 'loading' ? (
                  <p>Loading</p>
                ) : status === 'error' ? (
                  <p>rror</p>
                ) : ( */}
                    {data.data.data.items.map((single: I_Item) => (
                      <Tr>
                        <Td>{single.name}</Td>
                        <Td>{single.pricePerItem}</Td>
                        <Td>{single.quantity}</Td>
                        <Td>{single.estWgtPerItem}</Td>
                        <Td>{single.usShippingFee}</Td>
                        <Td>
                          {new Intl.NumberFormat('us-US', {
                            style: 'currency',
                            currency: 'usd',
                          }).format(
                            Math.floor(
                              100000000 *
                                parseFloat(single.pricePerItem.slice(1)) *
                                parseFloat(single.quantity) *
                                (parseFloat(
                                  data.data.data.customTax.slice(
                                    0,
                                    data.data.data.customTax.length - 1
                                  )
                                ) /
                                  100 +
                                  1) +
                                parseFloat(single.usShippingFee.slice(1))
                            ) / 100000000
                          )}
                        </Td>
                      </Tr>
                    ))}
                    <Tr
                      textTransform='uppercase'
                      fontWeight='var(--chakra-fontWeights-bold)'
                      fontSize='var(--chakra-fontSizes-xs)'
                      color='var(--chakra-colors-gray-900)'
                      letterSpacing='var(--chakra-letterSpacings-wider)'
                    >
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td>Total Weight</Td>
                      <Td>Total US Shipping</Td>
                      <Td>Subtotal</Td>
                    </Tr>
                    <Tr>
                      <Td></Td>
                      <Td></Td>
                      <Td></Td>
                      <Td>{data.data.data.totalEstimatedWeight}</Td>
                      <Td>
                        {data.data.data.items
                          .reduce((acc: number, current: I_Item) => {
                            console.log(acc);
                            return (
                              acc + parseFloat(current.usShippingFee.slice(1))
                            );
                          }, 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) + ' kg'}
                      </Td>
                      <Td>{data.data.data.totalBillUsd}</Td>
                    </Tr>
                  </Tbody>
                </Table>
                <HStack justifyContent='flex-end' mt={6}>
                  <Box w='400px'>
                    <HStack justifyContent='space-between'>
                      <Text fontWeight='bold'>Subtotal:</Text>
                      <Text>{data.data.data.totalBillUsd}</Text>
                    </HStack>
                    <HStack justifyContent='space-between'>
                      <Text fontWeight='bold'>After discount:</Text>
                      <Text>{data.data.data.afterDiscount}</Text>
                    </HStack>
                    <HStack justifyContent='space-between'>
                      <Text fontWeight='bold'>
                        Shipping To VN <br /> ({data.data.data.shippingRateToVn}{' '}
                        * {data.data.data.totalEstimatedWeight}){' '}
                      </Text>
                      <Text>
                        {new Intl.NumberFormat('us-US', {
                          style: 'currency',
                          currency: 'vnd',
                        }).format(
                          parseFloat(
                            data.data.data.totalEstimatedWeight.split(' ')[0]
                          ) * 240000
                        )}
                      </Text>
                    </HStack>
                    <HStack justifyContent='space-between'>
                      <Text fontWeight='bold'>USD / VND rate</Text>
                      <Text>{data.data.data.usdVndRate}</Text>
                    </HStack>
                    <HStack
                      justifyContent='space-between'
                      border='2px solid var(--chakra-colors-gray-600)'
                      p='4px 8px'
                      mt='6px'
                      borderRadius='lg'
                    >
                      <Text fontWeight='bold'>Total:</Text>
                      <Text>{data.data.data.actCharge}</Text>
                    </HStack>
                  </Box>
                </HStack>
              </>
            )
          )}
        </Box>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async function ({ req, res, params }: GetServerSidePropsContext) {
    return checkAuth(req, { id: params!.id });
  }
);
