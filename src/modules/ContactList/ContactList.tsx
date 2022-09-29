import React, { useCallback, useState, Suspense } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { onClick, Table } from "../../components/Table";
import { contactType, DELETE_CONTACT, GET_CONTACT_LIST } from "../../graphql";
import { getFavoriteLocalStorage } from "../../helpers";
import { pageInfoType } from "../../components/Table/TableFooter";
import { defaultPagination } from "../../constants";
import { Search } from "../../components/Search";

const ModalForm = dynamic(() => import("./partials/ModalForm"), {
  suspense: true,
});

const FavoriteList = dynamic(() => import("./FavoriteList"), {
  suspense: true,
});

type Props = {};

const ContactList = (props: Props) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const [pageInfo, setPageInfo] = useState<pageInfoType>({
    limit: 5,
    offset: 0,
    page: 1,
    canGoPrevPage: false,
    canGoNextPage: true,
  });
  const [dataContactList, setDataContactList] = useState<Array<contactType>>(
    []
  );
  const [dataFavoriteList, setDataFavoriteList] = useState<Array<contactType>>(
    []
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [timerSearchInput, setTimerSearchInput] = useState<any>();

  const { loading: loadingGetContactList, refetch: refetchGetContactList } =
    useQuery(GET_CONTACT_LIST, {
      fetchPolicy: "cache-and-network",
      variables: {
        ...defaultPagination,
        where: {
          first_name: {
            _iregex: searchInput,
          },
          last_name: {
            _iregex: searchInput,
          },
        },
      },
      onCompleted: (res) => {
        if (!res) return;

        clearTimeout(timerSearchInput);
        const favorites = getFavoriteLocalStorage();
        setDataFavoriteList(favorites);
        let dataSpecContactList = res?.contact;
        if (dataSpecContactList?.length) {
          dataSpecContactList = dataSpecContactList.map(
            (contact: contactType) => ({
              ...contact,
              isFavorite: favorites?.length
                ? favorites.find((fav: contactType) => fav.id === contact.id)
                : false,
            })
          );
          setDataContactList(dataSpecContactList);
        } else if (!!searchInput && !dataSpecContactList?.length) {
          setDataContactList([]);
        }
      },
    });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    onCompleted: (res) => {
      const newDataList = dataContactList.filter(
        (item) => item.id !== res?.delete_contact_by_pk?.id
      );
      if (!newDataList.length) refetchGetContactList(defaultPagination);
      setDataContactList(newDataList);
      toast({
        title: "Success Delete Contact",
        status: "success",
        isClosable: true,
        position: "top-right",
        duration: 1000,
      });
    },
    onError: () => {
      toast({
        title: "Error Delete Contact",
        status: "error",
        isClosable: true,
        position: "top-right",
        duration: 1000,
      });
    },
  });

  const handleOnClickFavorite = useCallback(
    ({ id, index, selected }: onClick) => {
      const selectedFavorite = dataContactList[index];
      setDataContactList((prev: Array<contactType>) => {
        const tempPrev = prev;
        const findIndex = tempPrev.findIndex((item) => item.id === id);
        if (findIndex !== -1) {
          tempPrev[findIndex].isFavorite = selected;
        }
        return [...tempPrev];
      });
      let favorites = getFavoriteLocalStorage();
      favorites = selected
        ? [...favorites, selectedFavorite]
        : favorites.filter((fav: contactType) => fav.id !== id);
      localStorage.setItem("FAVORITES", JSON.stringify(favorites));
      setDataFavoriteList(favorites);
      toast({
        title: selected ? "Success add favorite" : "Success remove favorite",
        status: "success",
        isClosable: true,
        position: "top-right",
        duration: 1000,
      });
    },
    [dataContactList, toast]
  );

  const handleOnClickMenuTable = useCallback(
    ({ id, type }: onClick) => {
      switch (type) {
        case "delete":
          deleteContact({
            variables: {
              id,
            },
          });
          break;
        case "edit":
          router.push({
            query: {
              edit: id,
            },
          });
          onOpen();
          break;
        default:
          break;
      }
    },
    [deleteContact, onOpen, router]
  );

  // add toast, pagination still not right
  const handleOnChangePage = useCallback(
    async ({
      page,
      limit,
      offset,
    }: Omit<pageInfoType, "canGoNextPage" | "canGoPrevPage">) => {
      const res = await refetchGetContactList({ limit, offset });
      if (res?.data?.contact?.length) {
        setPageInfo((prev) => ({
          ...prev,
          page,
          offset,
          canGoPrevPage: true,
          canGoNextPage: true,
        }));
      } else {
        setPageInfo((prev) => ({
          ...prev,
          canGoNextPage: false,
        }));
      }
    },
    [refetchGetContactList]
  );

  const handleSearchInput = useCallback(
    (event: any) => {
      clearTimeout(timerSearchInput);
      const time = setTimeout(() => {
        setSearchInput(event?.target?.value);
      }, 1000);
      setTimerSearchInput(time);
    },
    [timerSearchInput]
  );

  return (
    <Flex
      m={8}
      px={2}
      gap={10}
      flexWrap={{ base: "wrap", sm: "wrap", md: "wrap", lg: "nowrap" }}
    >
      <Box flexBasis={{ base: "100%", sm: "100%", md: "100%", lg: "50%" }}>
        <Text fontSize="xl" as="b">
          Contact List
        </Text>
        <Flex justifyContent="space-between" mb={6} mt={2}>
          <Search onChange={handleSearchInput} />
          <Button onClick={onOpen}>Add Contact</Button>
        </Flex>
        <Table
          pagination={{
            pageInfo,
            handleOnChangePage,
          }}
          data={dataContactList || []}
          handleOnClickTable={{
            menu: handleOnClickMenuTable,
            favorite: handleOnClickFavorite,
          }}
          EmptyData={!!searchInput ? "No result from search" : "Empty data"}
          isLoading={loadingGetContactList}
        />
        <Suspense fallback={`Loading...`}>
          <ModalForm isOpen={isOpen} onClose={onClose} />
        </Suspense>
      </Box>
      <Box flexBasis={{ base: "100%", sm: "100%", md: "100%", lg: "50%" }}>
        <Suspense fallback={`Loading...`}>
          <FavoriteList
            data={dataFavoriteList || []}
            handleOnClickFavorite={handleOnClickFavorite}
          />
        </Suspense>
      </Box>
    </Flex>
  );
};

export default ContactList;
