
import { useState } from 'react';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { PageHeader } from '../../components/common/PageHeader';
import { DeviceTable } from '../../features/devices/DeviceTable';
import { DeviceForm } from '../../features/devices/DeviceForm';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useCreateDevice, useDeleteDevice, useDevices, useUpdateDevice } from '../../features/devices/hooks';
import { Device } from '../../features/devices/api';

const DevicesPage = () => {
  const { devices, isLoading, error, refetch } = useDevices();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const toast = useToast();

  const createDeviceMutation = useCreateDevice();
  const updateDeviceMutation = useUpdateDevice();
  const deleteDeviceMutation = useDeleteDevice();

  const handleAddClick = () => {
    setSelectedDevice(null);
    onFormOpen();
  };

  const handleEditClick = (device: Device) => {
    setSelectedDevice(device);
    onFormOpen();
  };

  const handleDeleteClick = (device: Device) => {
    setSelectedDevice(device);
    onConfirmOpen();
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = { ...data, tags: data.tags.split(',').map((t: string) => t.trim()) };
      if (selectedDevice) {
        await updateDeviceMutation.mutate(selectedDevice.id, payload);
        toast({ title: 'Device updated', status: 'success' });
      } else {
        await createDeviceMutation.mutate(payload);
        toast({ title: 'Device created', status: 'success' });
      }
      refetch();
      onFormClose();
    } catch (error) {
      toast({ title: 'An error occurred', status: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedDevice) {
      try {
        await deleteDeviceMutation.mutate(selectedDevice.id);
        toast({ title: 'Device deleted', status: 'success' });
        refetch();
        onConfirmClose();
      } catch (error) {
        toast({ title: 'An error occurred', status: 'error' });
      }
    }
  };

  return (
    <Box>
      <PageHeader title="Devices" actionButtonText="Add Device" onActionButtonClick={handleAddClick} />
      <DeviceTable
        devices={devices}
        isLoading={isLoading}
        error={error}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAdd={handleAddClick}
      />
      <DeviceForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleFormSubmit}
        isSubmitting={createDeviceMutation.isLoading || updateDeviceMutation.isLoading}
        device={selectedDevice}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmDelete}
        title="Delete Device"
        body={`Are you sure you want to delete ${selectedDevice?.name}?`}
        isConfirming={deleteDeviceMutation.isLoading}
      />
    </Box>
  );
};

export default DevicesPage;
