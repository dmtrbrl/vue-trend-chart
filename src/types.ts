// `null` values are drawn as gaps. Objects can carry extra fields for use in
// `mouse-move` handlers. The `any` index signature lets user-defined
// interfaces be assigned (`unknown` doesn't).
export type DataPoint =
  number | null | { value: number | null; [key: string]: any };

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
  data: Array<DataPoint | undefined>;
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

export interface Point {
  x: number;
  y: number;
}
