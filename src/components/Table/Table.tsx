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
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
} from "@chakra-ui/react";
import {
  StarIcon,
  DragHandleIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";

import { contactType } from "../../graphql";
import { defaultImage } from "../../constants";

export type onClick = {
  index: number;
  id: number;
  type: "delete" | "edit" | "favorite";
  selected?: boolean;
};

type TableProps = {
  data: Array<contactType>;
  onClick: ({ index, id, type }: onClick) => void;
};

const Table = ({ data, onClick }: TableProps) => {
  return (
    <Box border={"1px"} m={8}>
      <Accordion allowMultiple>
        {data?.map((record: contactType, indexMaster: number) => (
          <AccordionItem key={record.id}>
            <AccordionButton
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              m={2}
            >
              <Flex gap={2} alignItems="center">
                <Box>
                  <Image
                    borderRadius="full"
                    boxSize="20"
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
                    onClick({
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
                        <DeleteIcon
                          color="black"
                          alignSelf="center"
                          display="flex"
                        />
                      }
                      iconSpacing="1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick({
                          id: record.id,
                          index: indexMaster,
                          type: "delete",
                        });
                      }}
                      color="white"
                    >
                      <Text color="black">Delete</Text>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onClick({
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
      {/* CHANGE TO PAGINATION */}
      <Box display="flex" justifyContent="flex-end">
        <div>pagination</div>
      </Box>
      {/* CHANGE TO PAGINATION */}
    </Box>
  );
};

export default Table;
