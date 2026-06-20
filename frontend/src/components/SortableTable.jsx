import { useMemo, useState } from "react";

export default function SortableTable({ columns, rows, defaultSort }) {
  const [sort, setSort] = useState(defaultSort || { key: columns[0].key, direction: "asc" });

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      const modifier = sort.direction === "asc" ? 1 : -1;
      if (typeof aValue === "string") return aValue.localeCompare(bValue) * modifier;
      return (aValue - bValue) * modifier;
    });
  }, [rows, sort]);

  function handleSort(key) {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <button type="button" onClick={() => handleSort(column.key)}>
                  {column.label}
                  <span aria-hidden="true">{sort.key === column.key ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.label}>
              {columns.map((column) => (
                <td key={column.key} className={getCellClassName(column, row)}>
                  {column.key === "growth" ? (
                    <span className={getGrowthBadgeClassName(row[column.key])}>
                      {column.format ? column.format(row[column.key]) : row[column.key]}
                    </span>
                  ) : (
                    column.format ? column.format(row[column.key]) : row[column.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getCellClassName(column, row) {
  if (column.key !== "growth") return undefined;
  return row[column.key] >= 0 ? "positive" : "negative";
}

function getGrowthBadgeClassName(value) {
  return `growth-badge ${value >= 0 ? "is-positive" : "is-negative"}`;
}
