import MetricCard from "../components/MetricCard.jsx";
import Panel from "../components/Panel.jsx";
import EmptyState from "../components/EmptyState.jsx";
import LineChart from "../components/charts/LineChart.jsx";
import BarChart from "../components/charts/BarChart.jsx";
import PieChart from "../components/charts/PieChart.jsx";
import { useState, useEffect } from "react";
import { compactCurrency, number, percent } from "../utils/formatters.js";
import { filterRows, groupBy, monthlyTrend, sumBy, yoyRows } from "../utils/metrics.js";

export default function OverviewTab({ filters }) {
  const [state, setState] = useState({ data: null, loading: true });
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
      const fetchData = async () => {
          setState({ data: null, loading: true });
          const params = new URLSearchParams(filters);
          if (filters.year) params.append("year", filters.year);
          if (filters.region) params.append("region", filters.region);
          if (filters.category) params.append("category", filters.category);

          try {
              const response = await fetch(`${baseUrl}/api/overview?${params.toString()}`);
              const result = await response.json();
              setState({ data: result, loading: false });
          } catch (error) {
              console.error("Error fetching overview data:", error);
              setState({ data: null, loading: false });
          }
      };

      fetchData();
  }, [filters]);

  const { data, loading } = state;
  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="tab-stack">
      <section className="metric-grid">
        <MetricCard title="Total Revenue" value={compactCurrency(data.totalRevenue)} />
        <MetricCard title="Total Profit" value={compactCurrency(data.totalProfit)} />
        <MetricCard title="Total Orders" value={number(data.totalOrders)} />
        <MetricCard title="Total Products Sold" value={number(data.totalProductsSold)} />
      </section>

      <section className="overview-grid">
        <Panel title="Revenue - Profit Trend" className="panel-large">
          <LineChart
            data={data.trendData}
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "profit", label: "Profit" },
            ]}
          />
        </Panel>

        <div className="side-stack">
          <Panel title="Year-over-year comparison" className="panel-yoy">
            <YoyContent yoy={data.yoy} />
          </Panel>
          <Panel title="Revenue by Payment Method" className="panel-pie">
            <PieChart data={data.paymentRevenue} />
          </Panel>
        </div>
      </section>

      <section className="two-column-grid overview-performance-grid">
        <Panel title="Category Revenue Performance">
          <BarChart data={data.categoryRevenue} />
        </Panel>
        <Panel title="Region Revenue Performance">
          <BarChart data={data.regionRevenue} />
        </Panel>
      </section>
    </div>
  );
}

function YoyContent({ yoy }) {
  if (yoy.type === "needsYear") {
    return <EmptyState title="" detail="Year-over-year comparison requires a specific year." />;
  }

  if (yoy.type === "noPrior") {
    return <EmptyState title="" detail="No prior year data available." />;
  }

  return (
    <table className="compact-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>{yoy.years[0]}</th>
          <th>{yoy.years[1]}</th>
          <th>Growth</th>
        </tr>
      </thead>
      <tbody>
        {yoy.rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>{row.label === "Revenue" || row.label === "Profit" ? compactCurrency(row.prior) : number(row.prior)}</td>
            <td>{row.label === "Revenue" || row.label === "Profit" ? compactCurrency(row.current) : number(row.current)}</td>
            <td className={row.growth >= 0 ? "positive" : "negative"}>
              <span className={`growth-badge ${row.growth >= 0 ? "is-positive" : "is-negative"}`}>
                {percent(row.growth * 100)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
