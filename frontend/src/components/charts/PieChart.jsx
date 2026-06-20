import {
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { compactCurrency } from "../../utils/formatters.js";
import { chartColors } from "./chartUtils.js";

export default function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="chart-frame pie-frame">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="54%"
            outerRadius="76%"
            paddingAngle={2}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((item, index) => (
              <Cell key={item.label} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => compactCurrency(value)} contentStyle={tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <text x="50%" y="45%" textAnchor="middle" className="recharts-center-value">
            {compactCurrency(total)}
          </text>
          <text x="50%" y="54%" textAnchor="middle" className="recharts-center-label">
            Revenue
          </text>
        </RePieChart>
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
