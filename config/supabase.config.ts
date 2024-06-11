import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { schema } from '../db'

const connectionString = process.env.SUPABASE_CONNECTION_STRING as string

function initDatabase() {
    try {
        console.info("Connecting to Supabase...")

        const client = postgres(connectionString)
        const db = drizzle(client, { schema });

        console.info("Connected to Supabase!")
        
        return db;

    } catch (error) {
        
        console.error("Error connecting to Supabase", error);
        return error;
    }
};


export { initDatabase };