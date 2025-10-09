
import { useMemo, useState } from 'react';
import { Box, Flex, Select } from '@chakra-ui/react';
import { PageHeader } from '../../components/common/PageHeader';
import { AlertsTable } from '../../features/alerts/AlertsTable';
import { useAlerts } from '../../features/alerts/hooks';
import { Alert } from '../../features/alerts/api';

const AlertsPage = () => {
  const { alerts, isLoading, error } = useAlerts();
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAlerts = useMemo(() => {
    return alerts
      .filter((alert: Alert) => severityFilter === 'all' || alert.severity === severityFilter)
      .filter((alert: Alert) => statusFilter === 'all' || alert.status === statusFilter);
  }, [alerts, severityFilter, statusFilter]);

  return (
    <Box>
      <PageHeader title="Alerts" />
      <Flex mb={4} gap={4}>
        <Select
          w="200px"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </Select>
        <Select
          w="200px"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="acked">Acknowledged</option>
          <option value="closed">Closed</option>
        </Select>
      </Flex>
      <AlertsTable alerts={filteredAlerts} isLoading={isLoading} error={error} />
    </Box>
  );
};

export default AlertsPage;
