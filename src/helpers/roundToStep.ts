// Default y label formatter: just enough decimals to tell ticks `step` apart,
// which also hides floating point noise (0.8999999999999999 -> 0.9)
export default (step: number) =>
  (value: number): number => {
    if (!(step > 0) || !Number.isFinite(step))
      return Number(value.toPrecision(12)) || 0;
    const decimals = Math.min(
      20,
      Math.max(0, 1 - Math.floor(Math.log10(step))),
    );
    // `|| 0` turns -0 into 0
    return Number(value.toFixed(decimals)) || 0;
  };
