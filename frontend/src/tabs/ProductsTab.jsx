import MetricCard from "../components/MetricCard.jsx";
import Panel from "../components/Panel.jsx";
import ComboChart from "../components/charts/ComboChart.jsx";
import ScatterChart from "../components/charts/ScatterChart.jsx";
import { useState, useEffect } from "react";
import { compactCurrency } from "../utils/formatters.js";

export default function ProductsTab({ filters }) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [state, setState] = useState({ data: null, loading: true });

  useEffect(() => {
      const fetchData = async () => {
          setState({ data: null, loading: true });
          const params = new URLSearchParams(filters);
          if (filters.year) params.append("year", filters.year);
          if (filters.region) params.append("region", filters.region);
          if (filters.category) params.append("category", filters.category);

          try {
              const response = await fetch(`${baseUrl}/api/products?${params.toString()}`);
              const result = await response.json();
              setState({ data: result, loading: false });
          } catch (error) {
              console.error("Error fetching products data:", error);
              setState({ data: null, loading: false });
          }
      };

      fetchData();
  }, [filters]);

  const { data, loading } = state;
  if (loading) return <div className="loading-state">Loading...</div>;

  const topRevenue = [...(data.products || [])].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const lowestRating = [...(data.products || [])].sort((a, b) => a.rating - b.rating).slice(0, 5);

  return (
    <div className="tab-stack">
      <section className="metric-grid">
        <MetricCard title="Total Revenue" value={compactCurrency(data.totalRevenue)} />
        <MetricCard title="Total Profit" value={compactCurrency(data.totalProfit)} />
        <MetricCard title="Average Rating" value={`${(data.averageRating || 0).toFixed(1)}/5.0`} />
        <MetricCard title="Total Discount Loss" value={compactCurrency(data.totalDiscountLoss)} />
      </section>

      <section className="products-grid">
        <Panel title="Product Profitability" className="panel-scatter">
          <ScatterChart data={data.products} />
        </Panel>

        <div className="side-stack">
          <Panel title="Discount Impact" className="panel-combo">
            <ComboChart data={data.discountBuckets || []} />
          </Panel>
          <Panel title="Product Watchlist" className="panel-watchlist">
            <ProductWatchlist topRevenue={topRevenue} lowestRating={lowestRating} />
          </Panel>
        </div>
      </section>
    </div>
  );
}

function ProductWatchlist({ topRevenue, lowestRating }) {
    return (
        <div className="watchlist-grid">
            <div>
                <h3>Top Revenue</h3>
                <ol>
                    {topRevenue.map((item) => (
                        <li key={item.label}>
                            <span className="watchlist-name">{item.label}</span>
                            <span className="watchlist-value">{compactCurrency(item.revenue)}</span>
                        </li>
                    ))}
                </ol>
            </div>
            <div>
                <h3>Lowest Rating</h3>
                <ol>
                    {lowestRating.map((item) => (
                        <li key={item.label}>
                            <span className="watchlist-name">{item.label}</span>
                            <span className="watchlist-value">{item.rating.toFixed(1)}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}