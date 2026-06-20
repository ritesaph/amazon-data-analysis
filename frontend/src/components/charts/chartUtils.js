export const chartColors = [
  "#D7770E",
  "#159947",
  "#3A6EA5",
  "#1593A5",
  "#8A6BBE",
  "#C85C73",
  "#F8972C",
  "#1e1e1e",
];

export const semanticColors = {
  revenue: "#D7770E",
  profit: "#159947",
  cost: "#F8972C",
  risk: "#000000",
  neutral: "#858585",
  grid: "#eeeeee",
  tick: "#858585",
};

export const categoryColors = {
  Books: "#3A6EA5",
  Electronics: "#D7770E",
  "Home & Kitchen": "#159947",
  Fashion: "#1593A5",
  Sports: "#8A6BBE",
  Beauty: "#C85C73",
};

export function scale(value, min, max, start, end) {
  if (max === min) return (start + end) / 2;
  return start + ((value - min) / (max - min)) * (end - start);
}

export function maxOf(items, key) {
  return Math.max(...items.map((item) => item[key]), 1);
}

export function toPoints(items, xKey, yKey, width, height, padding) {
  const xs = items.map((item, index) => (xKey ? item[xKey] : index));
  const ys = items.map((item) => item[yKey]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(0, ...ys);
  const maxY = Math.max(...ys, 1);

  return items.map((item, index) => {
    const xValue = xKey ? item[xKey] : index;
    return {
      ...item,
      x: scale(xValue, minX, maxX, padding.left, width - padding.right),
      y: scale(item[yKey], minY, maxY, height - padding.bottom, padding.top),
    };
  });
}
