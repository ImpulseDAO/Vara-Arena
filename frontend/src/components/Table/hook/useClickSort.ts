import { Dispatch, SetStateAction, useCallback } from 'react';
import { SortType } from '../constants';
import { TableColumnsType } from '../types';

type UseClickSortType = (
  setSortedColumn: Dispatch<
    SetStateAction<{
      field: string | undefined;
      sortType: SortType;
      sortName?: boolean;
    }>
  >
) => (column: TableColumnsType) => VoidFunction;

export const useClickSort: UseClickSortType = (setSortedColumn) => {
  return useCallback(
    (column) => {
      return () => {
        const { field, $sortable, sortName } = column;
        setSortedColumn((prev) => {
          if (!$sortable) {
            return prev;
          }

          if (prev.field === field) {
            let sortType =
              prev.sortType === SortType.ascending
                ? SortType.descending
                : prev.sortType === SortType.descending
                  ? SortType.default
                  : SortType.ascending;
            return { field, sortType, sortName };
          }
          return { field, sortType: SortType.ascending, sortName };
        });
      };
    },
    [setSortedColumn]
  );
};
