import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveTypesApi, UpdateLeaveTypeDto } from '@/api/leave-types.api';

export const useUpdateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaveTypeDto }) => 
      leaveTypesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'types'] });
    }
  });
};
