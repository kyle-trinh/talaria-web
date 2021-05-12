import { Box } from '@chakra-ui/core';
import { SkeletonText } from '@chakra-ui/skeleton';

export function LoadingLayout({ noOfLines }: { noOfLines: number }) {
  return (
    <Box padding='6'>
      <SkeletonText noOfLines={noOfLines} spacing='4' />
    </Box>
  );
}
