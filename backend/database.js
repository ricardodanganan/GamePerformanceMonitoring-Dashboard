const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./performance_data.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create a table to store historical data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS performance_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            cpu_usage REAL,
            cpu_temp REAL,
            ram_usage REAL,
            disk_usage REAL,
            gpu_usage REAL,
            gpu_temp REAL,
            vram_usage REAL,
            network_latency REAL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Performance metrics table is ready.');
        }
    });
});

module.exports = db;
