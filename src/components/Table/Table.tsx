import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import {
  StarIcon,
  DragHandleIcon,
  DeleteIcon,
  EditIcon,
  PhoneIcon,
} from "@chakra-ui/icons";

import { contactType } from "../../graphql";
import { defaultImage } from "../../constants";
import TableFooter, { TableFooterProps } from "./TableFooter";
import Image from "next/image";

export type onClick = {
  index: number;
  id: number;
  type: "delete" | "edit" | "favorite" | "addPhoneNumber";
  selected?: boolean;
};

type TableProps = {
  data: Array<contactType>;
  handleOnClickTable: ({ index, id, type }: onClick) => void;
} & TableFooterProps;

const Table: React.FC<TableProps> = ({
  data,
  handleOnClickTable,
  handleOnChangePage,
  pageInfo,
}) => {
  return (
    <Box border={"1px"}>
      {/* TODO: MOVE TO NEW FILE */}
      <Accordion allowMultiple defaultIndex={[]} allowToggle={false}>
        {data?.map((record: contactType, indexMaster: number) => (
          <AccordionItem key={record.id}>
            <AccordionButton
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image
                    width={80}
                    height={80}
                    style={{ borderRadius: "50%" }}
                    src={defaultImage}
                    alt="Dan Abramov"
                  />
                </Box>
                <Box>{`${record.first_name} ${record.last_name}`}</Box>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <IconButton
                  aria-label="button-favorite"
                  type="button"
                  onClick={(e) => {
                    handleOnClickTable({
                      index: indexMaster,
                      id: record.id,
                      type: "favorite",
                      selected: !record.isFavorite,
                    });
                    e.stopPropagation();
                  }}
                >
                  <StarIcon
                    color={record.isFavorite ? "ActiveBorder" : "Highlight"}
                  />
                </IconButton>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DragHandleIcon />
                  </MenuButton>
                  <MenuList color="white">
                    <MenuItem
                      icon={
                        <PhoneIcon
                          color="black"
                          alignSelf="center"
                          display="flex"
                        />
                      }
                      iconSpacing="1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnClickTable({
                          id: record.id,
                          index: indexMaster,
                          type: "addPhoneNumber",
                        });
                      }}
                      color="white"
                    >
                      <Text color="black">Add phone number</Text>
                    </MenuItem>
                    <MenuItem
                      icon={
                        <DeleteIcon
                          color="black"
                          alignSelf="center"
                          display="flex"
                        />
                      }
                      iconSpacing="1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnClickTable({
                          id: record.id,
                          index: indexMaster,
                          type: "delete",
                        });
                      }}
                      color="white"
                    >
                      <Text color="black">Delete</Text>
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOnClickTable({
                          id: record.id,
                          index: indexMaster,
                          type: "edit",
                        });
                      }}
                      icon={
                        <EditIcon
                          color="black"
                          alignSelf="center"
                          display="flex"
                        />
                      }
                      iconSpacing="1"
                      color="white"
                    >
                      <Text color="black">Edit</Text>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <AccordionIcon />
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {record.phones?.map((phone, index: number) => (
                <Box key={index} display="flex" flexDirection="column" gap={2}>
                  <Box m={2}>{`Phone ${index + 1}: ${phone.number}`}</Box>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {/* TODO: MOVE TO NEW FILE */}
      <TableFooter
        handleOnChangePage={handleOnChangePage}
        pageInfo={pageInfo}
      />
    </Box>
  );
};

export default React.memo(Table);
