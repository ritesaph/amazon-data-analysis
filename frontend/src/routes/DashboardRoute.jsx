import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "../components/Header.jsx";
import FilterBar from "../components/FilterBar.jsx";
import OverviewTab from "../tabs/OverviewTab.jsx";
import ProductsTab from "../tabs/ProductsTab.jsx";
import RegionsTab from "../tabs/RegionsTab.jsx";
import { salesRows } from "../data/salesData.js";

const tabs = ["Overview", "Products", "Regions"];

const initialFilters = {
  year: "All Years",
  region: "All Regions",
  category: "All Categories",
};

export default function DashboardRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(initialFilters);
  const tabParam = searchParams.get("tab");
  const activeTab = tabs.find((tab) => tab.toLowerCase() === tabParam) || "Overview";
  const [options, setOptions] = useState({
    years: ["All Years"],
    regions: ["All Regions"],
    categories: ["All Categories"]
  });

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/filters`);
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Failed to fetch filters:", error);
      }
    };

    fetchFilters();
  }, []); // fetch filters only once on component mount

  const visibleFilters = useMemo(() => {
    if (activeTab === "Overview") return ["year"];
    if (activeTab === "Products") return ["year", "region", "category"];
    return ["year", "category"];
  }, [activeTab]);

  function handleTabChange(tab) {
    setSearchParams(tab === "Overview" ? {} : { tab: tab.toLowerCase() });
  }

  return (
    <main className="dashboard-shell">
      <Header tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <FilterBar
        filters={filters}
        options={options}
        visibleFilters={visibleFilters}
        onChange={setFilters}
      />
      <section className="content-area">
        {activeTab === "Overview" && <OverviewTab filters={filters} />}
        {activeTab === "Products" && <ProductsTab rows={salesRows} filters={filters} />}
        {activeTab === "Regions" && <RegionsTab rows={salesRows} filters={filters} />}
      </section>
    </main>
  );
}