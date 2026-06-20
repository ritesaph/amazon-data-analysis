import { compactCurrency } from "../../utils/formatters.js";

export default function HeatmapChart({ matrix }) {
  if (!matrix?.values?.length) return <div className="chart-empty">No data</div>;

  const isSingleCategory = matrix.categories.length === 1;
  const cellWidth = isSingleCategory ? 156 : 96;
  const cellHeight = 38;
  const leftOffset = 112;
  const topOffset = 14;
  const bottomAxisY = topOffset + matrix.regions.length * cellHeight + 22;
  const width = leftOffset + matrix.categories.length * cellWidth + 16;
  const height = bottomAxisY + 24;
  const min = Math.min(...matrix.values.map((item) => item.value), 0);
  const max = Math.max(...matrix.values.map((item) => item.value), 1);
  const chartClassName = `chart heatmap-chart ${isSingleCategory ? "is-single-category" : ""}`;

  return (
    <div className="heatmap-shell">
      <div className="chart-scroll">
        <svg className={chartClassName} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue heatmap">
          <defs>
            <linearGradient id="heatmap-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#f7dfc0" />
              <stop offset="100%" stopColor="#D7770E" />
            </linearGradient>
          </defs>
        {matrix.categories.map((category, index) => (
          <text key={category} x={leftOffset + index * cellWidth + (cellWidth - 8) / 2} y={bottomAxisY} textAnchor="middle" className="axis-label">
            {category}
          </text>
        ))}
        {matrix.regions.map((region, rowIndex) => (
          <text key={region} x={leftOffset - 16} y={topOffset + rowIndex * cellHeight + cellHeight / 2 + 4} textAnchor="end" className="axis-label">
            {region}
          </text>
        ))}
        {matrix.values.map((item) => {
            const column = matrix.categories.indexOf(item.category);
            const row = matrix.regions.indexOf(item.region);
            const colValues = matrix.values
                .filter(v => v.category === item.category)
                .map(v => v.value);
            const colMin = Math.min(...colValues);
            const colMax = Math.max(...colValues);
            const intensity = (item.value - colMin) / (colMax - colMin || 1);
            const fill = heatmapColor(intensity);
            const x = leftOffset + column * cellWidth;
            const y = topOffset + row * cellHeight;
            return (
                <g key={`${item.region}-${item.category}`}>
                    <rect
                        x={x}
                        y={y}
                        width={cellWidth - 8}
                        height={cellHeight - 7}
                        rx="3"
                        fill={fill}
                    />
                    <text
                        x={x + (cellWidth - 8) / 2}
                        y={y + cellHeight / 2 + 4}
                        textAnchor="middle"
                        className={intensity > 0.62 ? "heatmap-cell-label is-dark" : "heatmap-cell-label"}
                        fontSize="9"
                        fontWeight="300"
                    >
                        {compactCurrency(item.value)}
                    </text>
                    <title>{`${item.region} ${item.category}: ${compactCurrency(item.value)}`}</title>
                </g>
            );
        })}
        </svg>
      </div>
      <div className="heatmap-legend" aria-label="Heatmap color legend">
        <span>Lower revenue</span>
        <i aria-hidden="true" />
        <span>Higher revenue</span>
      </div>
    </div>
  );
}

function heatmapColor(intensity) {
  const start = [247, 223, 192];
  const end = [215, 119, 14];
  const rgb = start.map((value, index) => Math.round(value + (end[index] - value) * intensity));
  return `rgb(${rgb.join(", ")})`;
}
