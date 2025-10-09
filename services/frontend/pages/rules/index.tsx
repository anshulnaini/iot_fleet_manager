
import { useState } from 'react';
import { Box, useDisclosure, useToast } from '@chakra-ui/react';
import { PageHeader } from '../../components/common/PageHeader';
import { RulesTable } from '../../features/rules/RulesTable';
import { RuleForm } from '../../features/rules/RuleForm';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useCreateRule, useDeleteRule, useRules, useUpdateRule } from '../../features/rules/hooks';
import { Rule } from '../../features/rules/api';

const RulesPage = () => {
  const { rules, isLoading, error, refetch } = useRules();
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  const toast = useToast();

  const createRuleMutation = useCreateRule();
  const updateRuleMutation = useUpdateRule();
  const deleteRuleMutation = useDeleteRule();

  const handleAddClick = () => {
    setSelectedRule(null);
    onFormOpen();
  };

  const handleEditClick = (rule: Rule) => {
    setSelectedRule(rule);
    onFormOpen();
  };

  const handleDeleteClick = (rule: Rule) => {
    setSelectedRule(rule);
    onConfirmOpen();
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedRule) {
        await updateRuleMutation.mutate(selectedRule.id, { ...data, enabled: selectedRule.enabled });
        toast({ title: 'Rule updated', status: 'success' });
      } else {
        await createRuleMutation.mutate({ ...data, enabled: true });
        toast({ title: 'Rule created', status: 'success' });
      }
      refetch();
      onFormClose();
    } catch (error) {
      toast({ title: 'An error occurred', status: 'error' });
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRule) {
      try {
        await deleteRuleMutation.mutate(selectedRule.id);
        toast({ title: 'Rule deleted', status: 'success' });
        refetch();
        onConfirmClose();
      } catch (error) {
        toast({ title: 'An error occurred', status: 'error' });
      }
    }
  };

  return (
    <Box>
      <PageHeader title="Rules" actionButtonText="Add Rule" onActionButtonClick={handleAddClick} />
      <RulesTable
        rules={rules}
        isLoading={isLoading}
        error={error}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAdd={handleAddClick}
        refetch={refetch}
      />
      <RuleForm
        isOpen={isFormOpen}
        onClose={onFormClose}
        onSubmit={handleFormSubmit}
        isSubmitting={createRuleMutation.isLoading || updateRuleMutation.isLoading}
        rule={selectedRule}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onConfirm={handleConfirmDelete}
        title="Delete Rule"
        body={`Are you sure you want to delete ${selectedRule?.name}?`}
        isConfirming={deleteRuleMutation.isLoading}
      />
    </Box>
  );
};

export default RulesPage;
