import { Flex, useColorMode, FlexProps } from "@chakra-ui/react";
import React from "react";

interface LayoutProps {
  height: string;
}

export const Layout: React.FC<LayoutProps> = (props: FlexProps) => {
  const { colorMode } = useColorMode();

  const bgColor = { light: "teal.600", dark: "gray.900" };

  const color = { light: "black", dark: "white" };
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    />
  );
};
