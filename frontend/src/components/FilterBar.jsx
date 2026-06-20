import SelectFilter from "./SelectFilter.jsx";

const filterConfig = {
  year: { label: "Year", stateKey: "year", optionKey: "years" },
  region: { label: "Region", stateKey: "region", optionKey: "regions" },
  category: { label: "Category", stateKey: "category", optionKey: "categories" },
};

export default function FilterBar({ filters, options, visibleFilters, onChange }) {
  return (
    <section className="filter-bar" aria-label="Dashboard filters">
      <span className="filter-label">Filter:</span>
      <div className="filter-controls">
        {visibleFilters.map((key) => {
          const config = filterConfig[key];
          return (
            <SelectFilter
              key={key}
              ariaLabel={config.label}
              value={filters[config.stateKey]}
              options={options[config.optionKey]}
              onChange={(nextValue) =>
                onChange((current) => ({
                  ...current,
                  [config.stateKey]: nextValue,
                }))
              }
            />
          );
        })}
      </div>
    </section>
  );
}
