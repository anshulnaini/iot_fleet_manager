
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Textarea } from '@chakra-ui/react';
import { Device } from './api';

interface DeviceFormData {
  name: string;
  type: string;
  locationHint?: string;
  tags: string; // For simplicity, we'll handle tags as a comma-separated string
}

interface DeviceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceFormData) => void;
  isSubmitting: boolean;
  device?: Device | null;
}

export const DeviceForm = ({ isOpen, onClose, onSubmit, isSubmitting, device }: DeviceFormProps) => {
  const { register, handleSubmit, reset } = useForm<DeviceFormData>();

  useEffect(() => {
    if (device) {
      reset({
        name: device.name,
        type: device.type,
        locationHint: device.locationHint,
        tags: device.tags.join(', '),
      });
    } else {
      reset({
        name: '',
        type: '',
        locationHint: '',
        tags: '',
      });
    }
  }, [device, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{device ? 'Edit Device' : 'Create Device'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input {...register('name', { required: true })} />
            </FormControl>
            <FormControl id="type" isRequired>
              <FormLabel>Type</FormLabel>
              <Input {...register('type', { required: true })} />
            </FormControl>
            <FormControl id="locationHint">
              <FormLabel>Location Hint</FormLabel>
              <Input {...register('locationHint')} />
            </FormControl>
            <FormControl id="tags">
              <FormLabel>Tags (comma-separated)</FormLabel>
              <Textarea {...register('tags')} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="primary" isLoading={isSubmitting}>
            {device ? 'Save Changes' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
