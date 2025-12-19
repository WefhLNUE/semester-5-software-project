import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leaveTypesApi, CreateLeaveTypeDto } from '@/api/leave-types.api';

export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeaveTypeDto) => leaveTypesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'types'] });
    }
  });
};
