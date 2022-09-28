import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import React, { useMemo } from "react";

export type pageInfoType = {
  limit: number;
  offset: number;
  page: number;
  canGoPrevPage: boolean;
  canGoNextPage: boolean;
};

export type TableFooterProps = {
  handleOnChangePage: ({
    page,
  }: Omit<pageInfoType, "canGoNextPage" | "canGoPrevPage">) => void;
  pageInfo: pageInfoType;
};

const TableFooter = ({ handleOnChangePage, pageInfo }: TableFooterProps) => {
  const page = useMemo(() => {
    const pageSpec = [
      {
        page: pageInfo.page - 1 > 0 ? pageInfo.page - 1 : pageInfo.page,
      },
      {
        page: pageInfo.page - 1 > 0 ? pageInfo.page : pageInfo.page + 1,
      },
      {
        page: pageInfo.page - 1 >= 1 ? pageInfo.page + 1 : pageInfo.page + 2,
      },
    ];
    return {
      currentPage: pageInfo.page,
      pages: pageSpec,
    };
  }, [pageInfo.page]);

  return (
    <Box display="flex" justifyContent="flex-end" my={2}>
      <Flex alignItems="center" gap={1}>
        <IconButton
          aria-label="button-left-pagination"
          disabled={page.currentPage === 1}
          onClick={() =>
            handleOnChangePage({
              page: page.currentPage - 1,
              limit: pageInfo.limit,
              offset: pageInfo.limit * (page.currentPage - 1),
            })
          }
        >
          <ChevronLeftIcon />
        </IconButton>
        {page?.pages.map((item, idx) => (
          <Button
            key={idx}
            border={item.page === pageInfo.page ? "2px" : "none"}
            onClick={() =>
              handleOnChangePage({
                page: item.page,
                limit: pageInfo.limit,
                offset: pageInfo.limit * (item.page - 1),
              })
            }
            disabled={idx > 1 && !pageInfo.canGoNextPage}
          >
            <Text>{item.page}</Text>
          </Button>
        ))}
        <IconButton
          aria-label="button-right-pagination"
          disabled={!pageInfo.canGoNextPage}
          onClick={() =>
            handleOnChangePage({
              page: page.currentPage + 1,
              limit: pageInfo.limit,
              offset: pageInfo.limit * (page.currentPage + 1),
            })
          }
        >
          <ChevronRightIcon />
        </IconButton>
      </Flex>
    </Box>
  );
};

export default React.memo(TableFooter);
