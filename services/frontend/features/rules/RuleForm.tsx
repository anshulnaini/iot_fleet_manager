
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Stack } from '@chakra-ui/react';
import { Rule } from './api';

interface RuleFormData {
  name: string;
  metric: string;
  operator: '>' | '=' | '<' | '<=';
  value: number;
  severity: 'info' | 'warning' | 'error';
}

interface RuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RuleFormData) => void;
  isSubmitting: boolean;
  rule?: Rule | null;
}

export const RuleForm = ({ isOpen, onClose, onSubmit, isSubmitting, rule }: RuleFormProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<RuleFormData>();

  useEffect(() => {
    if (rule) {
      reset(rule);
    } else {
      reset({
        name: '',
        metric: 'temperature_c',
        operator: '>',
        value: 0,
        severity: 'info',
      });
    }
  }, [rule, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{rule ? 'Edit Rule' : 'Create Rule'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input {...register('name', { required: true })} />
            </FormControl>
            <FormControl id="metric" isRequired>
              <FormLabel>Metric</FormLabel>
              <Select {...register('metric')}>
                <option value="temperature_c">Temperature (°C)</option>
                <option value="humidity_pct">Humidity (%)</option>
                <option value="battery_pct">Battery (%)</option>
              </Select>
            </FormControl>
            <FormControl id="operator" isRequired>
              <FormLabel>Operator</FormLabel>
              <Select {...register('operator')}>
                <option value=">">&gt;</option>
                <option value="=">=</option>
                <option value="<">&lt;</option>
                <option value="<=">&lt;=</option>
              </Select>
            </FormControl>
            <FormControl id="value" isRequired>
              <FormLabel>Value</FormLabel>
              <NumberInput onChange={(_, valueAsNumber) => setValue('value', valueAsNumber)} defaultValue={rule?.value ?? 0}>
                <NumberInputField {...register('value', { valueAsNumber: true })} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl id="severity" isRequired>
              <FormLabel>Severity</FormLabel>
              <Select {...register('severity')}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </Select>
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="primary" isLoading={isSubmitting}>
            {rule ? 'Save Changes' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
