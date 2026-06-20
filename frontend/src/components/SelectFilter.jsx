export default function SelectFilter({ ariaLabel, value, options, onChange }) {
  return (
    <label className="select-filter">
      <span className="sr-only">{ariaLabel}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {displayOption(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function displayOption(option) {
  return option.replace("All Regions", "Region").replace("All Categories", "Category");
}
