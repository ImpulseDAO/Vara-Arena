import { useEffect, useState } from 'react';
import { SortType } from '../constants';

type UseSortRowsType = (props: {
  sortedColumn: {
    field: string | undefined;
    sortType: SortType;
    sortName?: boolean;
  };
  rows: object[];
}) => object[];

export const useSortRows: UseSortRowsType = ({ sortedColumn, rows }) => {
  const [sortedRows, setSortedRows] = useState(rows);

  useEffect(() => {
    const cpRows = [...rows];
    const { field, sortName } = sortedColumn;

    if (field) {
      if (sortedColumn.sortType === SortType.ascending) {
        cpRows.sort((a, b) => {
          const name = sortName ? 'sortName' : field;
          console.log('name', name, sortName, field);
          const cpA = a[name].toUpperCase();
          const cpB = b[name].toUpperCase();

          if (cpA > cpB) {
            return 1;
          }
          if (cpB > cpA) {
            return -1;
          }
          return 0;
        });
      }
      if (sortedColumn.sortType === SortType.descending) {
        cpRows.sort((a, b) => {
          const name = sortName ? 'sortName' : field;
          const cpA = a[name].toUpperCase();
          const cpB = b[name].toUpperCase();

          if (cpA > cpB) {
            return -1;
          }
          if (cpB > cpA) {
            return 1;
          }
          return 0;
        });
      }
    }
    setSortedRows(cpRows);
  }, [rows, sortedColumn]);

  return sortedRows;
};
