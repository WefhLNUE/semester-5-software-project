import { useQuery } from '@tanstack/react-query';
import { settlementApi } from '@/api/settlement.api';

export const useSettlementCalculation = (employeeId: string, lastWorkingDay: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['leaves', 'settlement', employeeId, lastWorkingDay],
    queryFn: () => settlementApi.calculate(employeeId, lastWorkingDay),
    enabled: enabled && !!employeeId && !!lastWorkingDay,
    staleTime: 0 // Always recalculate
  });
};
