import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compactCurrency } from "../../utils/formatters.js";
import { chartColors, semanticColors } from "./chartUtils.js";

const seriesColorMap = {
  revenue: semanticColors.revenue,
  profit: semanticColors.profit,
};

export default function LineChart({ data, series, height = 300 }) {
  return (
    <div className="chart-frame" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 8, right: 22, left: 2, bottom: 12 }}>
          <CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: semanticColors.tick }} interval="preserveStartEnd" minTickGap={22} />
          <YAxis tick={{ fontSize: 11, fill: semanticColors.tick }} tickFormatter={compactCurrency} width={56} />
          <Tooltip formatter={(value) => compactCurrency(value)} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
          {series.map((item, index) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.label}
              stroke={seriesColorMap[item.key] || chartColors[index]}
              strokeWidth={2.5}
              dot={{ r: 2.5, strokeWidth: 1 }}
              activeDot={{ r: 4.5 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltipStyle = {
  border: "1px solid #E4E7EC",
  borderRadius: 8,
  boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
  fontSize: 12,
};
