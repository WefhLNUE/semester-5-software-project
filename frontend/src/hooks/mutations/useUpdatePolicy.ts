import { useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesApi, UpdatePolicyDto } from '@/api/policies.api';

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePolicyDto }) => 
      policiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'policies'] });
    }
  });
};
