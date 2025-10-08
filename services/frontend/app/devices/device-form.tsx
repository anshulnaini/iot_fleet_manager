'use client'

import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from '@chakra-ui/react';

interface DeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  device?: any;
}

export function DeviceForm({ isOpen, onClose, onSubmit, device }: DeviceFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: device,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{device ? 'Edit Device' : 'Add Device'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack as="form" id="device-form" onSubmit={handleSubmit(onSubmit)} spacing={4}>
            <FormControl>
              <FormLabel>ID</FormLabel>
              <Input {...register('id', { required: true })} />
            </FormControl>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input {...register('name', { required: true })} />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Input {...register('type', { required: true })} />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} type="submit" form="device-form">
            Save
          </Button>
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
