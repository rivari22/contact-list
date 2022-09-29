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
  Tag,
  TagLabel,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  StarIcon,
  DragHandleIcon,
  DeleteIcon,
  EditIcon,
} from "@chakra-ui/icons";

import { contactType } from "../../graphql";
import { defaultImage } from "../../constants";
import TableFooter, { TableFooterProps } from "./TableFooter";
import Image from "next/image";

export type onClick = {
  index: number;
  id: number;
  type: "delete" | "edit" | "favorite";
  selected?: boolean;
};

type TableProps = {
  data: Array<contactType>;
  handleOnClickTable: {
    favorite: ({ index, id, type }: onClick) => void;
    menu?: ({ index, id, type }: onClick) => void;
  };
  pagination?: TableFooterProps;
  EmptyData?: React.ReactNode | string;
  isLoading?: boolean;
};

const Table: React.FC<TableProps> = ({
  data,
  handleOnClickTable: {
    favorite: handleOnClickFavorite,
    menu: handleOnClickMenu,
  },
  pagination,
  EmptyData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Skeleton>
        <SkeletonText height={579} />
        
      </Skeleton>
    );
  }

  if (!data.length) {
    return (
      <Flex
        height={579}
        border={"1px"}
        justifyContent="center"
        alignItems="center"
      >
        {EmptyData ? <>{EmptyData}</> : <Text>Empty Data</Text>}
      </Flex>
    );
  }

  return (
    <Box border={"2px"} color="blackAlpha.300">
      {/* TODO: MOVE TO NEW FILE */}
      <Accordion
        allowMultiple
        defaultIndex={[]}
        allowToggle={false}
        maxHeight={579}
        minWidth={263}
        overflow="auto"
      >
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
                <Tag
                  size={"lg"}
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="whiteAlpha"
                  display="flex"
                  justifyContent="space-between"
                >
                  <TagLabel color="black">{`${record.first_name} ${record.last_name}`}</TagLabel>
                </Tag>
              </Flex>
              <Flex alignItems="center" gap={2}>
                <IconButton
                  aria-label="button-favorite"
                  type="button"
                  onClick={(e) => {
                    handleOnClickFavorite({
                      index: indexMaster,
                      id: record.id,
                      type: "favorite",
                      selected: !record.isFavorite,
                    });
                    e.stopPropagation();
                  }}
                >
                  <StarIcon
                    color={record.isFavorite ? "pink.500" : "Highlight"}
                  />
                </IconButton>
                {handleOnClickMenu && (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DragHandleIcon />
                    </MenuButton>
                    <MenuList color="white">
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOnClickMenu({
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
                          handleOnClickMenu({
                            id: record.id,
                            index: indexMaster,
                            type: "delete",
                          });
                        }}
                        color="white"
                      >
                        <Text color="black">Delete</Text>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                )}

                <AccordionIcon />
              </Flex>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {record.phones?.map((phone, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  gap={2}
                  m={2}
                  width={{ base: "96%", sm: "96%", md: "96%", lg: "30%" }}
                  minWidth={200}
                >
                  <Tag
                    size={"lg"}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="twitter"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <TagLabel>{`Phone ${index + 1}: ${phone.number}`}</TagLabel>
                  </Tag>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {/* TODO: MOVE TO NEW FILE */}
      {pagination && (
        <TableFooter
          handleOnChangePage={pagination.handleOnChangePage}
          pageInfo={pagination?.pageInfo}
        />
      )}
    </Box>
  );
};

export default React.memo(Table);
