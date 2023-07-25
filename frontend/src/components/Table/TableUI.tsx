import React, { FC, useState } from "react";
import { Styled } from "./styles";
import { TableColumnsType } from "./types";
import { SortType } from "./constants";
import { useSortRows } from "./hook/useSortRows";
import { useGetRowItems } from "./hook/useGetRowItems";
import { useClickSort } from "./hook/useClickSort";

export type TableUIProps = {
  columns: TableColumnsType[];
  rows: object[];
  cellClick?: (arg?: object) => void;
};

export const TableUI: FC<TableUIProps> = ({ columns, rows, cellClick }) => {
  const [sortedColumn, setSortedColumn] = useState<{
    field: string | undefined;
    sortName?: boolean;
    sortType: SortType;
  }>({ field: undefined, sortType: SortType.default });

  const sortedRows = useSortRows({ rows, sortedColumn });
  const RowItems = useGetRowItems({ columns, rows: sortedRows, cellClick });
  const onClickSort = useClickSort(setSortedColumn);

  return (
    <Styled.Container>
      <Styled.Columns>
        {columns.map((column) => (
          <Styled.Column
            position={column.position}
            key={column.field}
            style={{ width: column.width }}
            onClick={onClickSort(column)}
          >
            <Styled.ColumnText
              active={
                sortedColumn.sortType !== SortType.default &&
                sortedColumn.field === column.field
              }
              sortable={column.sortable}
            >
              {column.headerName}
            </Styled.ColumnText>
            {/* {column.sortable && (
              <Styled.ColumnIcon
                active={
                  sortedColumn.sortType !== SortType.default &&
                  sortedColumn.field === column.field
                }
                sortType={sortedColumn.sortType}
              >
                <IconUI iconName={IconName.ArrowDown} />
              </Styled.ColumnIcon>
            )} */}
          </Styled.Column>
        ))}
      </Styled.Columns>
      <Styled.Rows>{RowItems}</Styled.Rows>
    </Styled.Container>
  );
};
