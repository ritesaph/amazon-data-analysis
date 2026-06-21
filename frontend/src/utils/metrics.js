export function getFilterOptions(rows) {
  return {
    years: ["All Years", ...unique(rows.map((row) => String(row.year))).sort()],
    regions: ["All Regions", ...unique(rows.map((row) => row.region)).sort()],
    categories: ["All Categories", ...unique(rows.map((row) => row.category)).sort()],
  };
}

export function filterRows(rows, filters, keys = ["year", "region", "category"]) {
  return rows.filter((row) => {
    const matchYear = !keys.includes("year") || filters.year === "All Years" || row.year === Number(filters.year);
    const matchRegion = !keys.includes("region") || filters.region === "All Regions" || row.region === filters.region;
    const matchCategory =
      !keys.includes("category") || filters.category === "All Categories" || row.category === filters.category;

    return matchYear && matchRegion && matchCategory;
  });
}

export function sumBy(rows, field) {
  return rows.reduce((total, row) => total + row[field], 0);
}

export function averageBy(rows, field) {
  if (!rows.length) return 0;
  return rows.reduce((total, row) => total + row[field], 0) / rows.length;
}

export function groupBy(rows, key, metric = "revenue") {
  const map = new Map();
  rows.forEach((row) => {
    const label = typeof key === "function" ? key(row) : row[key];
    map.set(label, (map.get(label) || 0) + row[metric]);
  });
  return [...map.entries()].map(([label, value]) => ({ label, value }));
}

export function groupMetrics(rows, key, growthByRegion = {}) {
	const map = new Map();
	rows.forEach((row) => {
		const label = row[key];
		const item = map.get(label) || {
			label,
			revenue: 0,
			profit: 0,
			orders: 0,
			quantity: 0,
			discountLoss: 0,
			ratingTotal: 0,
			rows: 0,
		};
		item.revenue += row.revenue;
		item.profit += row.profit;
		item.orders += row.orders || 0;
		item.quantity += row.quantity;
		item.discountLoss += row.discountLoss || 0;
		item.ratingTotal += row.rating || 0;
		item.rows += 1;
		map.set(label, item);
	});

	return [...map.values()].map((item) => ({
		...item,
		rating: item.rows ? item.ratingTotal / item.rows : 0,
		margin: item.revenue ? item.profit / item.revenue : 0,
		growth: growthByRegion[item.label] ?? null,
	}));
}

export function monthlyTrend(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const key = `${row.year}-${row.monthIndex}`;
    const item = map.get(key) || {
      label: `${row.month} ${String(row.year).slice(2)}`,
      year: row.year,
      monthIndex: row.monthIndex,
      revenue: 0,
      profit: 0,
    };
    item.revenue += row.revenue;
    item.profit += row.profit;
    map.set(key, item);
  });

  return [...map.values()].sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);
}

export function productMetrics(rows) {
  return groupMetrics(rows, "product").map((item) => ({
    ...item,
    category: rows.find((row) => row.product === item.label)?.category || "",
  }));
}

export function discountBuckets(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const bucket = `${Math.floor(row.discount / 5) * 5}-${Math.floor(row.discount / 5) * 5 + 4}%`;
    const item = map.get(bucket) || { label: bucket, quantity: 0, marginTotal: 0, rows: 0 };
    item.quantity += row.quantity;
    item.marginTotal += row.margin * 100;
    item.rows += 1;
    map.set(bucket, item);
  });
  return [...map.values()].map((item) => ({
    label: item.label,
    quantity: item.quantity,
    margin: item.rows ? item.marginTotal / item.rows : 0,
  }));
}

export function paymentShareByRegion(rows) {
  const regions = unique(rows.map((row) => row.region)).sort();
  const methods = unique(rows.map((row) => row.paymentMethod)).sort();

  return regions.map((region) => {
    const regionRows = rows.filter((row) => row.region === region);
    const total = sumBy(regionRows, "revenue") || 1;
    const shares = methods.map((method) => ({
      label: method,
      value: sumBy(regionRows.filter((row) => row.paymentMethod === method), "revenue") / total,
    }));
    return { label: region, shares };
  });
}

export function heatmapMatrix(rows) {
  const regions = unique(rows.map((row) => row.region)).sort();
  const categories = unique(rows.map((row) => row.category)).sort();
  const values = regions.flatMap((region) =>
    categories.map((category) => ({
      region,
      category,
      value: sumBy(
        rows.filter((row) => row.region === region && row.category === category),
        "revenue",
      ),
    })),
  );

  return { regions, categories, values };
}

export function yoyRows(rows, selectedYear) {
  if (selectedYear === "All Years") return { type: "needsYear", rows: [] };
  const currentYear = Number(selectedYear);
  const priorYear = currentYear - 1;
  const currentRows = rows.filter((row) => row.year === currentYear);
  const priorRows = rows.filter((row) => row.year === priorYear);
  if (!priorRows.length) return { type: "noPrior", rows: [] };

  const metrics = [
    ["Revenue", "revenue"],
    ["Profit", "profit"],
    ["Orders", "orders"],
    ["Products", "quantity"],
  ];

  return {
    type: "table",
    years: [priorYear, currentYear],
    rows: metrics.map(([label, key]) => {
      const prior = sumBy(priorRows, key);
      const current = sumBy(currentRows, key);
      return {
        label,
        prior,
        current,
        growth: prior ? (current - prior) / prior : 0,
      };
    }),
  };
}

function unique(items) {
  return [...new Set(items)];
}
