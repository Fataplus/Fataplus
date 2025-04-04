/**
 * PostgreSQL Initialization Script for PocketBase
 * 
 * This script initializes the PostgreSQL database for PocketBase.
 * It creates the necessary extensions and tables.
 * 
 * Usage:
 * PGUSER=fataplus PGPASSWORD=fataplus_password PGHOST=localhost PGPORT=5432 PGDATABASE=fataplus node init-postgres.js
 */

import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// PostgreSQL connection configuration
const pgConfig = {
  user: process.env.PGUSER || 'fataplus',
  password: process.env.PGPASSWORD || 'fataplus_password',
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'fataplus',
};

// Connect to PostgreSQL
const client = new Client(pgConfig);

async function initializePostgres() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create extensions
    console.log('Creating extensions...');
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    
    console.log('PostgreSQL initialized successfully');
  } catch (error) {
    console.error('Error initializing PostgreSQL:', error);
  } finally {
    await client.end();
    console.log('Disconnected from PostgreSQL');
  }
}

initializePostgres();
