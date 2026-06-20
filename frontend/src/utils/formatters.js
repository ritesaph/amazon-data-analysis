export function compactCurrency(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${trim(value / 1_000_000)}M`;
  if (abs >= 1_000) return `$${trim(value / 1_000)}K`;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function money(value) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function number(value) {
  return Math.round(value).toLocaleString("en-US");
}

export function percent(value) {
  return `${Number(value).toFixed(1)}%`;
}

function trim(value) {
  return Number(value.toFixed(value >= 10 ? 1 : 2)).toLocaleString("en-US");
}
