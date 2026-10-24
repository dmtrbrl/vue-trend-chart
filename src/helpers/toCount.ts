// Counts from props: whole, non-negative and finite
export default (value: number | null | undefined): number =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
