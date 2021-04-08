import { Box } from "@chakra-ui/react";

export default function Custom404() {
  return (
    <>
      <Box
        gridArea="header"
        bg="white"
        borderTopLeftRadius="2xl"
        borderTopRightRadius="xl"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="0 40px"
      ></Box>
      <Box
        gridArea="main"
        bg="white"
        borderBottomLeftRadius="2xl"
        borderBottomRightRadius="xl"
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding="10px 40px"
        flexDirection="column"
        overflow="auto"
      >
        <h1>Sorry, the page you're looking for is not found</h1>
      </Box>
    </>
  );
}
