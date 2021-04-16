import { Td } from "@chakra-ui/react";
import { Th } from "@chakra-ui/table";
import { Tooltip } from "@chakra-ui/tooltip";
import React, { cloneElement } from "react";

interface CeilProps {
  index: number;
  freezeNo: number;
}

function TableCeil({
  index,
  freezeNo,
  ...props
}: React.PropsWithChildren<CeilProps>) {
  const freezeCol = index < freezeNo;

  return (
    <Th
      position={freezeCol ? "sticky" : "static"}
      bg={freezeCol ? "gray.300" : "gray.200"}
      maxW={freezeCol ? "200px" : ""}
      minW={freezeCol ? "200px" : ""}
      left={freezeCol ? 200 * index : ""}
      textTransform="capitalize"
      {...props}
    />
  );
}

export { TableCeil };
