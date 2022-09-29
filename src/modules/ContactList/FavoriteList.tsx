import React from "react";
import { Box, Text } from "@chakra-ui/react";

import { onClick, Table } from "../../components/Table";
import { contactType } from "../../graphql";

type Props = {
  data: Array<contactType>;
  handleOnClickFavorite: ({ index, id, type }: onClick) => void;
};

const FavoriteList = ({ data, handleOnClickFavorite }: Props) => {
  return (
    <Box pt={10} minWidth={263}>
      <Text fontSize="xl" as="b" data-testid="title-favorite-list-testid">
        Favorite List
      </Text>
      <Box mt={8}>
        <Table
          data={data}
          handleOnClickTable={{
            favorite: handleOnClickFavorite,
          }}
          dataTestId="table-favorite-list-testid"
        />
      </Box>
    </Box>
  );
};

export default React.memo(FavoriteList);
