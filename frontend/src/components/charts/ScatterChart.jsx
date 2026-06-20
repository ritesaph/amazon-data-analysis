import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart as ReScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis
} from "recharts";
import { compactCurrency } from "../../utils/formatters.js";
import { categoryColors, semanticColors } from "./chartUtils.js";

export default function ScatterChart({ data }) {
  if (!data || data.length === 0) return <div className="chart-empty">No data</div>;

	const grouped = data.reduce((acc, p) => {
		if (!acc[p.category]) acc[p.category] = [];
		acc[p.category].push(p);
		return acc;
	}, {});

  const categories = Object.keys(grouped);

	return (
    <div className="scatter-chart-wrap">
		<div className="chart-frame chart-frame-scatter">
			<ResponsiveContainer width="100%" height="100%">
				<ReScatterChart margin={{ top: 8, right: 16, bottom: 24, left: 2 }}>
          <CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" />
          <XAxis
              type="number"
              dataKey="quantity"
              name="Quantity Sold"
              tick={{ fontSize: 11, fill: semanticColors.tick }}
              label={{ value: "Quantity Sold", position: "insideBottom", offset: -4, fill: semanticColors.tick, fontSize: 12 }}
          />
					<YAxis
						type="number"
						dataKey="profit"
						name="Profit"
						tick={{ fontSize: 11, fill: semanticColors.tick }}
						tickFormatter={compactCurrency}
						width={64}
						label={{ value: "Profit", angle: -90, position: "insideLeft", fill: semanticColors.tick, fontSize: 12 }}
					/>
					<ZAxis type="number" dataKey="revenue" range={[20, 120]} />
					<Tooltip cursor={{ strokeDasharray: "4 4" }} content={<ScatterTooltip />} />

					{categories.map((category) => (
						<Scatter
							key={category}
							name={category}
							data={grouped[category]}
							fill={categoryColors[category] || semanticColors.revenue}
							opacity={0.75}
						/>
					))}
				</ReScatterChart>
			</ResponsiveContainer>
		</div>
      <ul className="scatter-category-legend" aria-label="Product categories">
        {categories.map((category) => (
          <li key={category} style={{ color: categoryColors[category] || semanticColors.revenue }}>
            <span style={{ background: categoryColors[category] || semanticColors.revenue }} />
            {category}
          </li>
        ))}
      </ul>
    </div>
	);
}

function ScatterTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{row.label}</strong>
      <span>Revenue: {compactCurrency(row.revenue)}</span>
      <span>Profit: {compactCurrency(row.profit)}</span>
      <span>Quantity: {row.quantity.toLocaleString("en-US")}</span>
    </div>
  );
}
