import { useQuery } from "@apollo/client";
import React, { useCallback, useState } from "react";
import { onClick, Table } from "../components/Table";

import { contactType, GET_CONTACT_LIST } from "../graphql";
import { getFavoriteLocalStorage } from "../helpers";

type Props = {};

const ContactList = (props: Props) => {
  const [dataContactList, setDataContactList] = useState<Array<contactType>>(
    []
  );

  const { loading } = useQuery(GET_CONTACT_LIST, {
    onCompleted: (res) => {
      if (!res) return;

      let favorites = getFavoriteLocalStorage();
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
      }
      setDataContactList(dataSpecContactList);
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
          break;

        default:
          break;
      }
    },
    []
  );

  if (loading) return <>loading</>;
  return (
    <section>
      <title>ContactList</title>
      <Table data={dataContactList || []} onClick={handleOnClickTable} />
    </section>
  );
};

export default ContactList;
