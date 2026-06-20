import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { number, percent } from "../../utils/formatters.js";
import { semanticColors } from "./chartUtils.js";

export default function ComboChart({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;

  return (
    <div className="chart-frame chart-frame-compact">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: semanticColors.tick }} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: semanticColors.tick }} tickFormatter={number} width={44} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: semanticColors.tick }} tickFormatter={percent} width={42} />
          <Tooltip content={<ComboTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
          <Bar yAxisId="left" dataKey="quantity" name="Quantity Sold" fill={semanticColors.revenue} radius={[5, 5, 0, 0]} maxBarSize={34} />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margin"
            name="Margin"
            stroke={semanticColors.profit}
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

function ComboTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.dataKey}>
          {item.name}: {item.dataKey === "margin" ? percent(item.value) : number(item.value)}
        </span>
      ))}
    </div>
  );
}
