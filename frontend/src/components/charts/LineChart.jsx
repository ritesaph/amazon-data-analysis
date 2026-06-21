import {
	CartesianGrid,
	Line,
	LineChart as ReLineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { compactCurrency } from "../../utils/formatters.js";
import { semanticColors } from "./chartUtils.js";

const legendItems = [
	{ label: "Revenue", color: semanticColors.revenue },
	{ label: "Profit", color: semanticColors.profit },
];

export default function StackedLineChart({ data, height = 440 }) {
	return (
		<div style={{ height, display: "flex", flexDirection: "column" }}>
			<div style={{ flex: 1, minHeight: 0 }}>
				<ResponsiveContainer width="100%" height="100%">
					<ReLineChart data={data} margin={{ top: 8, right: 22, left: 2, bottom: 0 }}>
						<CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="label" hide />
						<YAxis tick={{ fontSize: 11, fill: semanticColors.tick }} tickFormatter={compactCurrency} width={56} />
						<Tooltip formatter={(value) => compactCurrency(value)} contentStyle={tooltipStyle} />
						<Line type="monotone" dataKey="revenue" name="Revenue" stroke={semanticColors.revenue} strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 1 }} activeDot={{ r: 4.5 }} />
					</ReLineChart>
				</ResponsiveContainer>
			</div>

			<div style={{ flex: 1, minHeight: 0 }}>
				<ResponsiveContainer width="100%" height="100%">
					<ReLineChart data={data} margin={{ top: 8, right: 22, left: 2, bottom: 12 }}>
						<CartesianGrid stroke={semanticColors.grid} strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="label" tick={{ fontSize: 11, fill: semanticColors.tick }} interval="preserveStartEnd" minTickGap={22} />
						<YAxis tick={{ fontSize: 11, fill: semanticColors.profit }} tickFormatter={compactCurrency} width={56} domain={["dataMin", "dataMax"]} />
						<Tooltip formatter={(value) => compactCurrency(value)} contentStyle={tooltipStyle} />
						<Line type="monotone" dataKey="profit" name="Profit" stroke={semanticColors.profit} strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 1 }} activeDot={{ r: 4.5 }} />
					</ReLineChart>
				</ResponsiveContainer>
			</div>

			<div style={{ display: "flex", justifyContent: "center", gap: 16, paddingTop: 8, paddingBottom: 4 }}>
				{legendItems.map((item) => (
					<div key={item.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: semanticColors.tick }}>
						<span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: item.color, display: "inline-block" }} />
						{item.label}
					</div>
				))}
			</div>
		</div>
	);
}

const tooltipStyle = {
	border: "1px solid #E4E7EC",
	borderRadius: 8,
	boxShadow: "0 12px 28px rgba(15,23,42,0.10)",
	fontSize: 12,
};