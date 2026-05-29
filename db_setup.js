const { Pool } = require('pg');
require('dotenv').config({ override: true });

let poolInstance = null;

const pool = {
    query: (...args) => {
        if (!poolInstance) {
            throw new Error("Database pool is not initialized yet!");
        }
        return poolInstance.query(...args);
    },
    connect: (...args) => {
        if (!poolInstance) {
            throw new Error("Database pool is not initialized yet!");
        }
        return poolInstance.connect(...args);
    },
    end: (...args) => {
        if (poolInstance) {
            return poolInstance.end(...args);
        }
    }
};

async function setupDatabase() {
    let poolConfig = {};
    let connector = null;

    if (process.env.CLOUD_SQL_CONNECTION_NAME) {
        const { Connector } = require('@google-cloud/cloud-sql-connector');
        connector = new Connector();
        
        console.log("✓ Configuring Google Cloud SQL secure Language-Specific Connector...");
        console.log(`Connecting securely to Google Cloud SQL via Connector: ${process.env.CLOUD_SQL_CONNECTION_NAME}`);
        
        try {
            const clientOpts = await connector.getOptions({
                instanceConnectionName: process.env.CLOUD_SQL_CONNECTION_NAME,
                ipType: 'PUBLIC'
            });
            
            poolConfig = {
                ...clientOpts,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
            };
        } catch (err) {
            console.error("❌ Failed to retrieve Cloud SQL Connector options:", err.message);
            throw err;
        }
    } else {
        const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/resume_builder';
        const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
        poolConfig = {
            connectionString,
            ssl: !isLocal ? { rejectUnauthorized: false } : false
        };
        console.log("Connecting to PostgreSQL at:", connectionString.replace(/:[^:@]+@/, ':****@'));
    }

    poolInstance = new Pool(poolConfig);
    const client = await poolInstance.connect();
    try {
        // 1. Create Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                name VARCHAR(255),
                provider VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✓ 'users' table is verified/created.");

        // 2. Create Drafts Table with JSONB column for resume state S
        await client.query(`
            CREATE TABLE IF NOT EXISTS drafts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                resume_data JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT unique_user_draft_name UNIQUE(user_id, name)
            );
        `);
        console.log("✓ 'drafts' table is verified/created.");
        console.log("✓ PostgreSQL Database successfully initialized!");
    } catch (err) {
        console.error("❌ Error setting up PostgreSQL database:", err.message);
        throw err;
    } finally {
        client.release();
    }
}

module.exports = { setupDatabase, pool };

// Run setup immediately if executed directly
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log("✓ DB Setup script completed successfully.");
            process.exit(0);
        })
        .catch(err => {
            console.error("❌ DB Setup script failed:", err);
            process.exit(1);
        });
}
