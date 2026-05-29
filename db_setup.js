const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/resume_builder';

// SSL configurations (mandatory for cloud databases like Supabase, Render, neon.tech, etc.)
const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const pool = new Pool({
    connectionString,
    ssl: !isLocal ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
    console.log("Connecting to PostgreSQL at:", connectionString.replace(/:[^:@]+@/, ':****@')); // Hide credentials in log
    
    const client = await pool.connect();
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
