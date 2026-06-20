const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const regions = ["North", "South", "East", "West", "Central"];
const categories = ["Books", "Electronics", "Home", "Fashion", "Toys", "Beauty"];
const payments = ["Credit Card", "Debit Card", "E-Wallet", "Bank Transfer"];

const productCatalog = [
  { name: "Books 2637", category: "Books", rating: 1.2, discount: 18 },
  { name: "Kindle Case", category: "Books", rating: 4.7, discount: 9 },
  { name: "Echo Dot", category: "Electronics", rating: 4.6, discount: 12 },
  { name: "Fire Tablet", category: "Electronics", rating: 4.2, discount: 20 },
  { name: "Coffee Maker", category: "Home", rating: 4.4, discount: 7 },
  { name: "Desk Lamp", category: "Home", rating: 4.1, discount: 15 },
  { name: "Running Shoes", category: "Fashion", rating: 4.3, discount: 10 },
  { name: "Travel Hoodie", category: "Fashion", rating: 3.8, discount: 16 },
  { name: "Puzzle Box", category: "Toys", rating: 4.8, discount: 6 },
  { name: "Robot Kit", category: "Toys", rating: 4.5, discount: 14 },
  { name: "Skin Serum", category: "Beauty", rating: 4.0, discount: 13 },
  { name: "Hair Dryer", category: "Beauty", rating: 3.6, discount: 17 },
];

function makeRow(year, monthIndex, product, regionIndex, productIndex) {
  const region = regions[regionIndex % regions.length];
  const paymentMethod = payments[(monthIndex + regionIndex + productIndex) % payments.length];
  const seasonality = 0.86 + monthIndex * 0.035;
  const yearlyLift = 1 + (year - 2021) * 0.14;
  const regionLift = 0.9 + regionIndex * 0.065;
  const categoryLift = 0.85 + categories.indexOf(product.category) * 0.055;
  const units = Math.round((46 + productIndex * 5 + monthIndex * 3) * regionLift);
  const revenue = Math.round(units * 2550 * yearlyLift * seasonality * categoryLift);
  const marginRate = 0.15 + ((productIndex + regionIndex) % 5) * 0.018 - product.discount / 500;
  const profit = Math.round(revenue * marginRate);
  const discountLoss = Math.round((revenue * product.discount) / 100);

  return {
    id: `${year}-${monthIndex}-${region}-${product.name}`,
    year,
    month: months[monthIndex],
    monthIndex,
    date: `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`,
    region,
    category: product.category,
    product: product.name,
    paymentMethod,
    revenue,
    profit,
    orders: Math.max(18, Math.round(units / 3)),
    quantity: units,
    rating: product.rating,
    discount: product.discount,
    discountLoss,
    margin: Number((profit / revenue).toFixed(3)),
  };
}

export const salesRows = [];

for (let year = 2021; year <= 2024; year += 1) {
  months.forEach((_, monthIndex) => {
    productCatalog.forEach((product, productIndex) => {
      const regionIndex = (monthIndex + productIndex + year) % regions.length;
      salesRows.push(makeRow(year, monthIndex, product, regionIndex, productIndex));
    });
  });
}


// color for graphs and charts
export const palette = {
  black: "#000000",
  blackSoft: "#1e1e1e",
  white: "#ffffff",
  orangeLight: "#D7770E",
  orangeDark: "#F8972C",
  grayText: "#858585",
  grayMuted: "#b8b8b8",
  page: "#f0f0f0",
};
