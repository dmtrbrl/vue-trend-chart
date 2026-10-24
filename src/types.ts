// Numeric strings are read as numbers. `null`, `undefined`, non-finite and
// non-numeric values are drawn as gaps.
export type DataValue = number | string | null | undefined;

// Objects can carry extra fields for use in `mouse-move` handlers. The `any`
// index signature lets user-defined interfaces be assigned (`unknown`
// doesn't).
export type DataPoint = DataValue | { value: DataValue; [key: string]: any };

export interface TrendChartDataset {
  data: DataPoint[];
  className?: string;
  smooth?: boolean;
  stroke?: boolean;
  fill?: boolean;
  showPoints?: boolean;
}

export interface TrendChartGridOptions {
  verticalLines?: boolean;
  verticalLinesNumber?: number;
  horizontalLines?: boolean;
  horizontalLinesNumber?: number;
}

export interface TrendChartLabelsOptions {
  xLabels?: Array<string | number>;
  yLabels?: number;
  yLabelsTextFormatter?: (value: number) => string | number;
}

export interface TrendChartMouseMoveEvent {
  index: number;
  // One entry per dataset; undefined when a dataset has no point at this index
  data: DataPoint[];
}

export interface Boundary {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Domain {
  min: number;
  max: number;
}

export interface YTick {
  y: number;
  value: number;
}

// A label's bounding box in its own coordinates, around its anchor
export interface LabelBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Where a label sits along an axis (0 at the plot's start, 1 at its end) and
// how far it reaches before and after that point
export interface LabelReach {
  at: number;
  before: number;
  after: number;
}

export interface Point {
  x: number;
  y: number;
}
