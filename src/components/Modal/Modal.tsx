import {
  Modal as ModalChakra,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as ModalChakraProps,
} from "@chakra-ui/react";
import React from "react";

export type ModalProps = Pick<
  ModalChakraProps,
  "isOpen" | "onClose" | "children"
> & {
  title?: string;
  onClickSubmit: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onClickSubmit }) => {
  return (
    <ModalChakra isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title || "Title modal"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClickSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </ModalChakra>
  );
};

export default Modal;
