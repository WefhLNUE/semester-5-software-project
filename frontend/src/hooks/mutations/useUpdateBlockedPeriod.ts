import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockedPeriodsApi, UpdateBlockedPeriodDto } from '@/api/blocked-periods.api';

export const useUpdateBlockedPeriod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBlockedPeriodDto }) => 
      blockedPeriodsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves', 'blocked-periods'] });
      queryClient.invalidateQueries({ queryKey: ['leaves', 'calendars'] });
    }
  });
};
