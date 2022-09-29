import { useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useState, Suspense, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Box, Button, Flex, useDisclosure, useToast } from "@chakra-ui/react";

import { onClick, Table } from "../../components/Table";
import {
  ADD_PHONE_TO_CONTACT,
  contactType,
  DELETE_CONTACT,
  GET_CONTACT_LIST,
} from "../../graphql";
import { getFavoriteLocalStorage } from "../../helpers";
import { pageInfoType } from "../../components/Table/TableFooter";
import { defaultPagination } from "../../constants";
import { Search } from "../../components/Search";

const ModalForm = dynamic(() => import("./partials/ModalForm"), {
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
  const [searchInput, setSearchInput] = useState<string>("");
  const [timerSearchInput, setTimerSearchInput] = useState<any>();

  const { loading, refetch: refetchGetContactList } = useQuery(
    GET_CONTACT_LIST,
    {
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
        let dataSpecContactList = res?.contact;
        if (dataSpecContactList?.length) {
          dataSpecContactList = dataSpecContactList.map(
            (contact: contactType) => ({
              ...contact,
              isFavorite: favorites?.length
                ? favorites.includes(contact.id)
                : false,
            })
          );
          setDataContactList(dataSpecContactList);
        } else {
          // handle search empty
        }
      },
    }
  );

  // TODO ADD PHONE TO CONTACT WITH ID
  // const [addPhoneToContact] = useMutation(ADD_PHONE_TO_CONTACT)

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

  const handleOnClickTable = useCallback(
    ({ id, index, type, selected }: onClick) => {
      switch (type) {
        case "favorite":
          setDataContactList((prev: Array<contactType>) => {
            const tempPrev = prev;
            tempPrev[index].isFavorite = selected;
            return [...tempPrev];
          });
          let favorites = getFavoriteLocalStorage();
          favorites = selected
            ? [...favorites, id]
            : favorites.filter((fav: number) => fav !== id);
          localStorage.setItem("FAVORITES", JSON.stringify(favorites));
          toast({
            title: selected
              ? "Success add favorite"
              : "Success remove favorite",
            status: "success",
            isClosable: true,
            position: "top-right",
            duration: 1000,
          });
          break;
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
    [deleteContact, onOpen, router, toast]
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
        console.log(event?.target?.value);
        setSearchInput(event?.target?.value);
      }, 1000);
      setTimerSearchInput(time);
    },
    [timerSearchInput]
  );

  return (
    <Box m={8} px={2}>
      <title>ContactList</title>
      <Flex justifyContent="space-between" mb={6}>
        <Search onChange={handleSearchInput} />
        <Button onClick={onOpen}>Add Contact</Button>
      </Flex>
      <Table
        pageInfo={pageInfo}
        data={dataContactList || []}
        handleOnClickTable={handleOnClickTable}
        handleOnChangePage={handleOnChangePage}
      />
      <Suspense fallback={`Loading...`}>
        <ModalForm isOpen={isOpen} onClose={onClose} />
      </Suspense>
    </Box>
  );
};

export default ContactList;
