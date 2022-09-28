import { useMutation } from "@apollo/client";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { Modal, ModalProps } from "../../../components/Modal";
import { ADD_CONTACT } from "../../../graphql";

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
  const [addPhoneNumber, setAddPhoneNumber] = useState<string[]>([""]);
  const [formState, setFormState] = useState<FormStateType>(initFormState);

  const handleOnCloseModal = useCallback(() => {
    setAddPhoneNumber([""]);
    setFormState(initFormState);
    onClose();
  }, [onClose]);

  const [addContact] = useMutation(ADD_CONTACT, {
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
      console.log(temp, "temp");
      temp.push("");
      return [...temp];
    });
  }, []);

  const handleOnSubmit = useCallback(() => {
    const payload = {
      first_name: formState.firstName,
      last_name: formState.lastName,
      phones: addPhoneNumber.map((phone: string) => ({ number: phone })),
    };
    addContact({ variables: payload });
  }, [formState, addPhoneNumber, addContact]);

  return (
    <Modal
      isOpen={isOpen}
      title="Add Contact"
      onClose={handleOnCloseModal}
      onClickSubmit={handleOnSubmit}
    >
      <FormControl>
        <FormLabel>First name</FormLabel>
        <Input
          placeholder="First name"
          name="firstName"
          onChange={handleOnChange}
        />
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Last name</FormLabel>
        <Input
          placeholder="Last name"
          name="lastName"
          onChange={handleOnChange}
        />
      </FormControl>

      {addPhoneNumber?.map((item, index) => (
        <FormControl mt={4} key={index}>
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
      ))}

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
    </Modal>
  );
};

export default ModalForm;
