import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Text,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { Modal, ModalProps } from "../../../components/Modal";
import {
  ADD_CONTACT,
  EDIT_CONTACT,
  GET_CONTACT_DETAIL,
} from "../../../graphql";
import { notAllowedSpecialCharsRegex } from "../../../constants";

type FormStateType = {
  firstName: string;
  lastName: string;
};

type Props = Omit<ModalProps, "children" | "title" | "onClickSubmit"> & {
  data?: {
    phoneNumber: string[];
    formState: FormStateType;
  };
};

const initFormState = {
  firstName: "",
  lastName: "",
};

const ModalForm = ({ isOpen, onClose }: Props) => {
  const toast = useToast();
  const router = useRouter();
  const editId = router?.query?.edit;

  const [addPhoneNumber, setAddPhoneNumber] = useState<string[]>([""]);
  const [formState, setFormState] = useState<FormStateType>(initFormState);

  const [getContactDetail] = useLazyQuery(GET_CONTACT_DETAIL, {
    fetchPolicy: "cache-and-network",
    onCompleted: (res) => {
      if (!res) return;

      const result = res.contact_by_pk;
      if (result) {
        setFormState({
          firstName: result.first_name,
          lastName: result.last_name,
        });
      }
    },
    onError: (err) => {
      toast({
        title: `Error get detail, Error message: ${err?.message}`,
        status: "error",
        isClosable: true,
        position: "top-right",
        duration: 2000,
      });
    },
  });

  useEffect(() => {
    const controller = new window.AbortController();

    if (!!editId) {
      getContactDetail({
        variables: { id: +editId },
        context: {
          signal: controller.signal,
        },
      });
    }

    return () => controller.abort();
  }, [getContactDetail, editId]);

  const handleOnCloseModal = useCallback(() => {
    setAddPhoneNumber([""]);
    setFormState(initFormState);
    router.push({ query: "" });
    onClose();
  }, [onClose, router]);

  const [addContact, { loading }] = useMutation(ADD_CONTACT, {
    onCompleted: (res) => {
      toast({
        title: "Success Add Contact",
        status: "success",
        isClosable: true,
        position: "top-right",
        duration: 1000,
      });
      handleOnCloseModal();
    },
    onError: (err) => {
      toast({
        title: `Error: ${err.message}`,
        status: "error",
        isClosable: true,
        position: "top-right",
        duration: 2000,
      });
    },
  });

  const [updateContact] = useMutation(EDIT_CONTACT, {
    onCompleted: (res) => {
      toast({
        title: "Success Edit Contact",
        status: "success",
        isClosable: true,
        position: "top-right",
        duration: 1000,
      });
      handleOnCloseModal();
    },
    onError: (err) => {
      toast({
        title: `Error: ${err.message}`,
        status: "error",
        isClosable: true,
        position: "top-right",
        duration: 2000,
      });
    },
  });

  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
      const newValue = e?.target?.value;
      if (typeof index === "number") {
        return setAddPhoneNumber((prev) => {
          const temp = [...prev];
          temp[index] = newValue;
          return [...temp];
        });
      }
      setFormState((prev) => ({
        ...prev,
        [e?.target?.name]: newValue,
      }));
    },
    []
  );

  const handleAddFieldPhoneNumber = useCallback(() => {
    setAddPhoneNumber((prev) => {
      const temp = [...prev];
      temp.push("");
      return [...temp];
    });
  }, []);

  const handleOnSubmit = useCallback(async () => {
    const payload = {
      first_name: formState.firstName,
      last_name: formState.lastName,
      phones: addPhoneNumber.map((phone: string) => ({ number: phone })),
    };

    const nameIsInvalid = notAllowedSpecialCharsRegex.test(
      `${payload.first_name} ${payload.last_name}`
    );
    if (nameIsInvalid) {
      return toast({
        title: `Warning: Firstname or lastname cannot special character`,
        status: "warning",
        isClosable: true,
        position: "top-right",
        duration: 2000,
      });
    }
    if (payload.first_name)
    if (editId) {
      await updateContact({
        variables: {
          id: +editId,
          _set: {
            first_name: payload.first_name,
            last_name: payload.last_name,
          },
        },
      });
    } else {
      addContact({ variables: payload });
    }
  }, [formState.firstName, formState.lastName, addPhoneNumber, editId, toast, updateContact, addContact]);

  return (
    <Modal
      isOpen={isOpen}
      title={`${editId ? "Edit" : "Add"} Contact`}
      onClose={handleOnCloseModal}
      onClickSubmit={handleOnSubmit}
    >
      <Skeleton isLoaded={!loading}>
        <FormControl>
          <FormLabel>First name</FormLabel>
          <Input
            placeholder="First name"
            name="firstName"
            onChange={handleOnChange}
            value={formState.firstName}
          />
        </FormControl>
      </Skeleton>

      <Skeleton isLoaded={!loading}>
        <FormControl mt={4}>
          <FormLabel>Last name</FormLabel>
          <Input
            placeholder="Last name"
            name="lastName"
            onChange={handleOnChange}
            value={formState.lastName}
          />
        </FormControl>
      </Skeleton>

      {!editId && (
        <>
          {addPhoneNumber?.map((item, index) => (
            <Skeleton isLoaded={!loading} key={index}>
              <FormControl mt={4}>
                <FormLabel>{`Phone number ${index + 1}`}</FormLabel>
                <Input
                  placeholder="Phone Number"
                  type="number"
                  name="phoneNumber"
                  min={0}
                  value={item}
                  onChange={(e) => handleOnChange(e, index)}
                />
              </FormControl>
            </Skeleton>
          ))}
          <Skeleton isLoaded={!loading}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={2}
              gap={2}
              onClick={handleAddFieldPhoneNumber}
              cursor="pointer"
            >
              <IconButton aria-label="btn-add-phone-number">
                <AddIcon />
              </IconButton>
              <Text>Add more phone number</Text>
            </Box>
          </Skeleton>
        </>
      )}
    </Modal>
  );
};

export default ModalForm;
