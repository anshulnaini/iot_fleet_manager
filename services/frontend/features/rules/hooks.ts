
import { useState, useEffect } from 'react';
import { getRules, createRule, updateRule, deleteRule, Rule } from './api';

export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setIsLoading(true);
    getRules()
      .then(setRules)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refetch();
  }, []);

  return { rules, isLoading, error, refetch };
};

export const useCreateRule = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data: Omit<Rule, 'id'>) => {
    setIsLoading(true);
    try {
      const newRule = await createRule(data);
      setIsLoading(false);
      return newRule;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading };
};

export const useUpdateRule = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (id: string, data: Partial<Omit<Rule, 'id'>>) => {
    setIsLoading(true);
    try {
      const updatedRule = await updateRule(id, data);
      setIsLoading(false);
      return updatedRule;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading };
};

export const useDeleteRule = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteRule(id);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  return { mutate, isLoading };
};
