import { ReactNode, useMemo } from 'react';
import { TableColumnsType } from '../types';
import { Styled } from '../styles';

export const useGetRowItems = ({
  columns,
  rows,
}: {
  columns: TableColumnsType[];
  rows: object[];
}) => {
  return useMemo((): ReactNode => {
    return rows.map((row, i) => {
      const items = columns.reduce<ReactNode[]>((acc, cur, i) => {
        const item = (
          <Styled.Cell
            position={cur.position}
            key={i}
            style={{ width: cur.width }}
          >
            {row[cur.field]}
          </Styled.Cell>
        );

        return [...acc, item];
      }, []);
      return <Styled.Row key={i}>{items}</Styled.Row>;
    });
  }, [columns, rows]);
};
