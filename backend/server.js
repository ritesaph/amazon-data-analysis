const express = require("express");
const cors = require("cors");
const fs = require("fs");
const parser = require("csv-parser");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5000;

let salesData = [];

app.use(cors());

fs.createReadStream("../data/cleaned_dataset.csv")
    // clean tab and space
    .pipe(parser({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => typeof value === 'string' ? value.trim() : value
    }))
    .on("data", (data) => salesData.push(data))
    .on("end", () => {
        console.log(`CSV file successfully processed. Total Rows: ${salesData.length}`);
    });

app.get("/api/overview", (req, res) => {
    // bypass caching
    res.setHeader('Cache-Control', 'no-store');

    const getFirst = (param) => Array.isArray(param) ? param[0] : param;
    
    const year = getFirst(req.query.year);
    const region = getFirst(req.query.region);
    const category = getFirst(req.query.category);

    let filteredData = salesData;

    const getYear = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).getFullYear().toString();
    };

    if (year && !year.includes("All")) filteredData = filteredData.filter(item => getYear(item.order_date) === String(year));
    if (region && !region.includes("All")) filteredData = filteredData.filter(item => item.customer_region === region);
    if (category && !category.includes("All")) filteredData = filteredData.filter(item => item.product_category === category);

    const totalRevenue = filteredData.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const totalProfit = filteredData.reduce((sum, item) => sum + parseFloat(item.profit || 0), 0);
    const totalOrders = filteredData.length;
    const totalProductsSold = filteredData.reduce((sum, item) => sum + parseInt(item.quantity_sold || 0), 0);

    const trendMap = filteredData.reduce((acc, item) => {
        if (!item.order_date) return acc;
        const d = new Date(item.order_date);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // make unique label to access trend data
        const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        
        if (!acc[label]) acc[label] = { label, revenue: 0, profit: 0 };
        acc[label].revenue += parseFloat(item.total_revenue || 0);
        acc[label].profit += parseFloat(item.profit || 0);
        return acc;
    }, {});
    const trendData = Object.values(trendMap);

    const getGrouped = (field) => Object.entries(filteredData.reduce((acc, item) => {
        if (item[field]) acc[item[field]] = (acc[item[field]] || 0) + parseFloat(item.total_revenue || 0);
        return acc;
    }, {})).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

    let yoy = { type: "needsYear" };
    
    if (year && !year.includes("All")) {
        let priorData = salesData.filter(d => getYear(d.order_date) === String(Number(year) - 1));
        if (region && !region.includes("All")) priorData = priorData.filter(item => item.customer_region === region);
        if (category && !category.includes("All")) priorData = priorData.filter(item => item.product_category === category);

        if (priorData.length === 0) {
            yoy = { type: "noPrior" };
        } else {
            yoy = {
                type: "success", 
                years: [Number(year) - 1, Number(year)],
                rows: [
                    { label: "Revenue", prior: priorData.reduce((s, i) => s + parseFloat(i.total_revenue || 0), 0), current: totalRevenue },
                    { label: "Profit", prior: priorData.reduce((s, i) => s + parseFloat(i.profit || 0), 0), current: totalProfit },
                    { label: "Orders", prior: priorData.length, current: totalOrders },
                    { label: "Products", prior: priorData.reduce((s, i) => s + parseInt(i.quantity_sold || 0), 0), current: totalProductsSold }
                ].map(r => ({ ...r, growth: r.prior === 0 ? 0 : (r.current - r.prior) / r.prior }))
            };
        }
    }

    res.json({
        totalRevenue,
        totalProfit,
        totalOrders,
        totalProductsSold,
        categoryRevenue: getGrouped("product_category"),
        regionRevenue: getGrouped("customer_region"),
        paymentRevenue: getGrouped("payment_method"),
        yoy,
        trendData
    });
});

app.get("/api/filters", (req, res) => {
    const uniqueYears = new Set();
    const uniqueRegions = new Set();
    const uniqueCategories = new Set();

    salesData.forEach(item => {
        if (item.order_date) {
            const year = new Date(item.order_date).getFullYear().toString();
            uniqueYears.add(year);
        }
        if (item.customer_region) uniqueRegions.add(item.customer_region);
        if (item.product_category) uniqueCategories.add(item.product_category);
    });

    const yearsArray = Array.from(uniqueYears).sort((a, b) => b - a); // sort years, swap if positive values (b > a)
    const regionsArray = Array.from(uniqueRegions);
    const categoriesArray = Array.from(uniqueCategories);

    res.json({
        years: ["All Years", ...yearsArray],
        regions: ["All Regions", ...regionsArray],
        categories: ["All Categories", ...categoriesArray]
    });
});

app.get("/api/products", (req, res) => {
    // bypass caching
    res.setHeader('Cache-Control', 'no-store');

    const getFirst = (param) => Array.isArray(param) ? param[0] : param;
    
    const year = getFirst(req.query.year);
    const region = getFirst(req.query.region);
    const category = getFirst(req.query.category);

    let filteredData = salesData;

    const getYear = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).getFullYear().toString();
    };

    if (year && !year.includes("All")) filteredData = filteredData.filter(item => getYear(item.order_date) === String(year));
    if (region && !region.includes("All")) filteredData = filteredData.filter(item => item.customer_region === region);
    if (category && !category.includes("All")) filteredData = filteredData.filter(item => item.product_category === category);

    const averageRating = filteredData.reduce((sum, item) => sum + parseFloat(item.rating || 0), 0) / (filteredData.length || 1);
    const totalRevenue = filteredData.reduce((sum, item) => sum + parseFloat(item.total_revenue || 0), 0);
    const totalProfit = filteredData.reduce((sum, item) => sum + parseFloat(item.profit || 0), 0);
    const totalDiscountLoss = filteredData.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        const discountedPrice = parseFloat(item.discounted_price || 0);
        const qty = parseInt(item.quantity_sold || 0);
        return sum + ((price - discountedPrice) * qty);
    }, 0);

    // for scatter plot and product watchlist
    const productMap = {};
    filteredData.forEach(item => {
        const label = `${item.product_category} ${item.product_id}`; // identifier
        if (!productMap[label]) {
            productMap[label] = {
                label: label,
                category: item.product_category,
                quantity: 0,
                revenue: 0,
                profit: 0,
                totalRating: 0,
                ratingCount: 0
            };
        }
        productMap[label].quantity += parseInt(item.quantity_sold || 0);
        productMap[label].revenue += parseFloat(item.total_revenue || 0);
        productMap[label].profit += parseFloat(item.profit || 0);
        
        const r = parseFloat(item.rating || 0);
        if (r > 0) {
            productMap[label].totalRating += r;
            productMap[label].ratingCount += 1;
        }
    });

    const products = Object.values(productMap).map(p => ({
        ...p,
        rating: p.ratingCount > 0 ? p.totalRating / p.ratingCount : 0
    }));

    const sampledProducts = Object.values(
        products.reduce((acc, p) => {
            if (!acc[p.category]) acc[p.category] = [];
            acc[p.category].push(p);
            return acc;
        }, {})
    ).flatMap(group => group.sort((a, b) => b.quantity - a.quantity).slice(0, 50));


    // for combo chart
    const bucketMap = {};
    filteredData.forEach(item => {
        const dp = parseFloat(item.discount_percent || 0);
        const lowerBound = Math.floor(dp / 5) * 5;
        const upperBound = lowerBound + 4;
        const bucketLabel = `${lowerBound}-${upperBound}%`;

        if (!bucketMap[bucketLabel]) {
            bucketMap[bucketLabel] = { label: bucketLabel, quantity: 0, profit: 0, revenue: 0 };
        }
        bucketMap[bucketLabel].quantity += parseInt(item.quantity_sold || 0);
        bucketMap[bucketLabel].profit += parseFloat(item.profit || 0);
        bucketMap[bucketLabel].revenue += parseFloat(item.total_revenue || 0);
    });

    const discountBuckets = Object.values(bucketMap).map(b => ({
        label: b.label,
        quantity: b.quantity,
        margin: b.revenue > 0 ? b.profit / b.revenue : 0 
    })).sort((a, b) => parseInt(a.label) - parseInt(b.label));

    res.json({
        totalRevenue,
        totalProfit,
        averageRating,
        totalDiscountLoss,
        products: sampledProducts,
        discountBuckets
    });
});

app.get("/api/region", (req, res) => {
    res.setHeader('Cache-Control', 'no-store');

    const getFirst = (param) => Array.isArray(param) ? param[0] : param;

    const year = getFirst(req.query.year);
    const category = getFirst(req.query.category);

    let filteredData = salesData;

    const getYear = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).getFullYear().toString();
    };

    if (year && !year.includes("All")) filteredData = filteredData.filter(item => getYear(item.order_date) === String(year));
    if (category && !category.includes("All")) filteredData = filteredData.filter(item => item.product_category === category);

    const rows = filteredData.map(item => ({
        year: getYear(item.order_date),
        region: item.customer_region,
        category: item.product_category,
        paymentMethod: item.payment_method,
        revenue: parseFloat(item.total_revenue || 0),
        profit: parseFloat(item.profit || 0),
        quantity: parseInt(item.quantity_sold || 0),
    }));

    res.json({ rows });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});