import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compactCurrency } from "../../utils/formatters.js";
import { semanticColors } from "./chartUtils.js";

const COLOR_DEFAULT = semanticColors.revenue;
const COLOR_HIGHEST = semanticColors.profit;
const COLOR_LOWEST  = "#BF4646";

export default function BarChart({ data = [], height = 250 }) {
  if (!data.length) return null;

  const getColor = (index) => {
    if (index === 0) return COLOR_HIGHEST;
    if (index === data.length - 1) return COLOR_LOWEST;
    return COLOR_DEFAULT;
  };

  return (
    <div className="chart-frame" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 8, right: 14, left: 0, bottom: 12 }}>
          <CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: semanticColors.tick }}
            tickFormatter={shortLabel}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: semanticColors.tick }}
            tickFormatter={compactCurrency}
            width={52}
          />
          <Tooltip formatter={(value) => compactCurrency(value)} contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={46}>
            {data.map((item, index) => (
              <Cell key={item.label} fill={getColor(index)} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function shortLabel(label) {
  return label.length > 10 ? `${label.slice(0, 8)}.` : label;
}

const tooltipStyle = {
  border: "1px solid #E4E7EC",
  borderRadius: 8,
  boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
  fontSize: 12,
};