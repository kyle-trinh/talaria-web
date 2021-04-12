import React, { Dispatch, SetStateAction } from "react";
import { Menu, MenuButton, MenuItem, MenuList, Button } from "@chakra-ui/react";

interface FreezeColProps {
  freezeNo: number;
  setFreezeNo: Dispatch<SetStateAction<number>>;
}

const options = [2, 3, 4, 5, 6];

export default function FreezeCol({ freezeNo, setFreezeNo }: FreezeColProps) {
  return (
    <Menu>
      <MenuButton as={Button}>Freeze Columns ({freezeNo})</MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem key={option} onClick={() => setFreezeNo(option)}>
            {option} {option === freezeNo && "- current"}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
