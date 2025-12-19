import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveTypesApi } from '@/api/leave-types.api';

export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leaveTypesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'types'] });
    }
  });
};
