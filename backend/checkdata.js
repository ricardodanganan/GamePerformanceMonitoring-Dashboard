const sqlite3 = require("sqlite3").verbose();

// Connect to the database
const db = new sqlite3.Database("./performance_data.db");

// Run the query
db.all(
    "SELECT * FROM performance_metrics WHERE timestamp >= datetime('now', '-12 hours')",
    [],
    (err, rows) => {
        if (err) {
            console.error("Error fetching data:", err.message);
        } else {
            console.log("Historical Data (Last 12 hours):", rows);
        }
        db.close();
    }
);
