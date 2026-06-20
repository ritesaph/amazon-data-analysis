import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { percent } from "../../utils/formatters.js";
import { chartColors, semanticColors } from "./chartUtils.js";

export default function StackedBarChart({ data }) {
  const methods = data[0]?.shares.map((item) => item.label) || [];
  const chartData = data.map((region) => ({
    label: region.label,
    ...Object.fromEntries(region.shares.map((share) => [share.label, parseFloat((share.value * 100).toFixed(1))])),
  }));

  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={chartData} layout="vertical" margin={{ top: 8, right: 14, left: 0, bottom: 10 }}>
          <CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} allowDataOverflow={true} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 11, fill: semanticColors.tick }} />
          <YAxis type="category" dataKey="label" width={72} tick={{ fontSize: 12, fill: semanticColors.tick }} />
          <Tooltip formatter={(value) => percent(value)} contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} formatter={shortMethod} iconType="circle" />
          {methods.map((method, index) => (
            <Bar key={method} dataKey={method} stackId="payment" fill={chartColors[index % chartColors.length]} radius={index === methods.length - 1 ? [0, 6, 6, 0] : [0, 0, 0, 0]}>
              {chartData.map((row) => (
                <Cell key={`${row.label}-${method}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Bar>
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

function shortMethod(method) {
  return method.replace("Transfer", "Trf.");
}

const tooltipStyle = {
  border: "1px solid #E4E7EC",
  borderRadius: 8,
  boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
  fontSize: 12,
};
