export type ColumnId =
  | "demand"
  | "optimizerPlan"
  | "projectPlan"
  | "approvedPlan"
  | "execution";

export type RowData = {
  id: string;
  status: string;
  note: string;
  wagonNumber: string;
};

export type ColumnData = {
  rows: RowData[];
};

export type LogisticsData = {
  [key in ColumnId]: ColumnData;
};

export type ColumnItem = {
  id: ColumnId;
  title: string;
  data: ColumnData;
  color: string;
};

export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceData: ColumnData;
  targetData: ColumnData;
  sourceTitle: string;
  targetTitle: string;
  sourceColor: string;
  targetColor: string;
}

export interface DetailedViewProps {
  isOpen: boolean;
  onClose: () => void;
  item: RowData;
}

export interface ColumnViewProps {
  column: ColumnItem;
  onAcceptItem: (columnId: ColumnId, rowId: string, action: string) => void;
  onAcceptAllPlan: (columnId: ColumnId) => void;
  onViewDetails: (item: RowData) => void;
  onExpand: (columnId: ColumnId) => void;
}

export interface ExpandedColumnViewProps {
  column: ColumnItem;
  onClose: () => void;
  onAcceptItem: (columnId: ColumnId, rowId: string, action: string) => void;
  onAcceptAllPlan: (columnId: ColumnId) => void;
  onViewDetails: (item: RowData) => void;
}

export interface ChartViewProps {
  data: LogisticsData;
}

export interface MapViewProps {
  data: LogisticsData;
}

export type StatusChartData = {
  name: string;
  value: number;
};

export type ColumnChartData = {
  name: string;
  обеспечен: number;
  необеспечен: number;
  корректировка: number;
};

export type TimeChartData = {
  date: string;
  обеспечен: number;
  необеспечен: number;
  корректировка: number;
};

export type RouteData = {
  id: number;
  from: string;
  to: string;
  status: string;
  wagonCount: number;
  distance: number;
};
