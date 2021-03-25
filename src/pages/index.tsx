import { Box } from "@chakra-ui/layout";
import Header from "../components/Header";

const Index = () => {
  return (
    <>
      <Header title="Dashboard" />
      <Box
        gridArea="header"
        bg="white"
        borderTopLeftRadius="2xl"
        borderTopRightRadius="xl"
      >
        header
      </Box>
      <Box
        gridArea="main"
        bg="white"
        borderBottomLeftRadius="2xl"
        borderBottomRightRadius="xl"
      >
        body
      </Box>
    </>
  );
};

export default Index;
