import { ReactNode, useMemo } from "react";
import { TableColumnsType } from "../types";
import { Styled } from "../styles";

export const useGetRowItems = ({
  columns,
  rows,
  cellClick,
}: {
  columns: TableColumnsType[];
  rows: object[];
  cellClick?: (arg: object) => void;
}) => {
  return useMemo((): ReactNode => {
    return rows.map((row, i) => {
      const items = columns.reduce<ReactNode[]>((acc, cur, i) => {
        const item = (
          <Styled.Cell
            $position={cur.$position}
            key={i}
            style={{ width: cur.width }}
            $ableClick={!!cellClick}
          >
            <div onClick={() => cellClick?.(row)}>{row[cur.field]}</div>
          </Styled.Cell>
        );

        return [...acc, item];
      }, []);
      return <Styled.Row key={i}>{items}</Styled.Row>;
    });
  }, [cellClick, columns, rows]);
};
