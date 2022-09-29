import React from "react";
import { Box, Input, InputProps } from "@chakra-ui/react";

export type SearchProps = Pick<InputProps, "onChange" | "isInvalid" | "value" | "onKeyDown">;

const Search = ({ onChange, isInvalid, value, onKeyDown }: SearchProps) => {
  return (
    <Box flexBasis="50%">
      <Input
        isInvalid={isInvalid}
        errorBorderColor="crimson"
        placeholder="Search by name"
        onChange={onChange}
        value={value}
        onKeyDown={onKeyDown}
      />
    </Box>
  );
};

export default Search;
