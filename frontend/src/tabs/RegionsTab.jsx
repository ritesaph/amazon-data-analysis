import Panel from "../components/Panel.jsx";
import SortableTable from "../components/SortableTable.jsx";
import HeatmapChart from "../components/charts/HeatmapChart.jsx";
import StackedBarChart from "../components/charts/StackedBarChart.jsx";
import { useState, useEffect } from "react";
import { compactCurrency, number, percent } from "../utils/formatters.js";
import { groupMetrics, heatmapMatrix, paymentShareByRegion } from "../utils/metrics.js";

const columns = [
	{ key: "label", label: "Region" },
	{ key: "revenue", label: "Revenue", format: compactCurrency },
	{ key: "profit", label: "Profit", format: compactCurrency },
	{ key: "quantity", label: "Products Sold", format: number },
	{ key: "margin", label: "Margin", format: (value) => percent(value * 100) },
	{ key: "growth", label: "Growth", format: (value) => value != null ? percent(value * 100) : "—" },
];

export default function RegionsTab({ filters }) {
	const [state, setState] = useState({ rows: [], growthByRegion: {}, loading: true });
	const baseUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchData = async () => {
			setState({ rows: [], growthByRegion: {}, loading: true });
			const params = new URLSearchParams();
			if (filters.year) params.append("year", filters.year);
			if (filters.category) params.append("category", filters.category);

			try {
				const response = await fetch(`${baseUrl}/api/region?${params.toString()}`);
				const result = await response.json();
				setState({ rows: result.rows, growthByRegion: result.growthByRegion, loading: false });
			} catch (error) {
				console.error("Error fetching region data:", error);
				setState({ rows: [], growthByRegion: {}, loading: false });
			}
		};

		fetchData();
	}, [filters]);

	const { rows, growthByRegion, loading } = state;
	if (loading) return <div className="loading-state">Loading...</div>;

	const regionRows = groupMetrics(rows, "region", growthByRegion);

	return (
		<div className="tab-stack">
			<Panel title="Region Scorecard" className="panel-scorecard">
				<SortableTable columns={columns} rows={regionRows} defaultSort={{ key: "revenue", direction: "desc" }} />
			</Panel>

			<section className="two-column-grid">
				<Panel title="Market Affinity">
					<HeatmapChart matrix={heatmapMatrix(rows)} />
				</Panel>
				<Panel title="Payment Preference">
					<StackedBarChart data={paymentShareByRegion(rows)} />
				</Panel>
			</section>
		</div>
	);
}