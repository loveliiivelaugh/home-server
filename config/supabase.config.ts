
// import { createClient } from '@supabase/supabase-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// const creds = {
//     url: import.meta.env.SUPABASE_URL as string,
//     key: import.meta.env.SUPABASE_PUBLIC_KEY as string
// };

// // Create a single supabase client for interacting with your database
// const supabaseClient = createClient(creds.url, creds.key);

const connectionString = process.env.SUPABASE_CONNECTION_STRING as string

function initDatabase() {
    try {
        console.info("Connecting to Supabase...")

        const client = postgres(connectionString)
        const db = drizzle(client);

        console.info("Connected to Supabase!")
        
        return db;

    } catch (error) {
        
        console.error("Error connecting to Supabase", error);
        return error;
    }

}

export { initDatabase }