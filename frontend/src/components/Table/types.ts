export type TableColumnsType = {
  width: string | number;
  field: string;
  headerName: string;
  sortable?: boolean;
  type?: "number" | "string" | "node";
  position?: "left" | "right" | "center";
  sortName?: boolean;
  onClick?: (arg?: object) => void;
};
