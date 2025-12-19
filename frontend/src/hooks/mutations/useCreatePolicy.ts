import { useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesApi, CreatePolicyDto } from '@/api/policies.api';

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePolicyDto) => policiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'policies'] });
    }
  });
};
