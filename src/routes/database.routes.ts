// Packages
import { Hono } from 'hono';
import { Context } from 'hono';
import { validator } from 'hono/validator'
import { eq } from 'drizzle-orm';
// import { zValidator } from '@hono/zod-validator'

import { schema } from '../../db';
import { scripts } from '../scripts';
import { validationMap } from '../../db/schemas';


const databaseRoutes = new Hono();


/**
 * @openapi
 * /database/read_schema:
 *   get:
 *     description: Gets all tables and columns for the database
 *     responses:
 */
databaseRoutes.get('/read_schema', async (c: Context) => {
    try {
        const tables = Object.keys(schema);
        const tablesWithColumns = tables
            .map((table: string | any) => {

                if (["usersRelations", "validations"].includes(table)) return null;

                const columns = Object
                    .keys((schema as any)[table])
                    .map((column: string) => ({
                        ...(schema as any)[table][column].config,
                        default: ((schema as any)[table][column]?.default || null)
                    }));
                
                const data = ({
                    table,
                    columns
                });

                // console.log("data: ", data);

                return data;
            })
            .filter((value: any) => value);

        return c.json(tablesWithColumns, 201);

    } catch (error: any) {

        return c.json(error, 500);
    }
});

/**
 * @swagger
 * /database/read_db:
 *   get:
 *     summary: Returns stuff
 *     responses:
 */
databaseRoutes.get('/read_db', async (c: Context) => {
    const table = c.req.query('table') || 'table_name';
    // const { sensativeClient } = c.var.clients;
    const { db } = c.var;

    const options = {
        // columns: {
        //     name: true,
        //     value: true,
        //     messages: false, //ignored
        // },
    };
    
    try {

        console.log("/read_db.table: ", table)
        
        const data = await db
            .query
            ?.[table]
            .findMany(options);

        // if (table === "models") return c.json(
        //     await scripts.updateStoredModelsList({ 
        //         sensativeClient, 
        //         storedModels: data, 
        //         db 
        //     })
        // )
        // else 
        return c.json(data, 201);

    } catch (error: any) {
        console.error(error);
        
        return c.json(error, 500);
    }
});

/**
 * @swagger
 * /database/read_db:
 *   get:
 *     summary: Returns stuff
 *     responses:
 */
// For aichat app to query the conversation history ...
// ... given the chat session id
databaseRoutes.get('/read_one_row', async (c: Context) => {
    const queryParams = c.req.queries();
    console.log('/read_one_row: ', queryParams)
    let table = 'chats';
    let id = null;
    if (queryParams) {
        table = queryParams.table[0]
        id = queryParams.id[0]
    };
    const { db } = c.var;
    // const tableSchema = schema[table];

    try {
        const data = await db
            .query
            ?.[table]
            .findMany();

        const filteredData = !id 
            ? data[0] 
            : data.find(({ session_id }: { session_id: string }) => (session_id === id));
        
        return c.json(filteredData || [], 201);
        
    } catch (error: any) {
        console.error(error)
        
        return c.json(error, 500)
    }
});

/**
 * @swagger
 * /database/updae_db:
 *   get:
 *     summary: Returns stuff
 *     tags: [database]
 *     responses:
 */ 
databaseRoutes.put('/update_db', async (c: Context) => {
    const { db } = c.var;
    const payload = await c.req.json();
    const tableSchema = schema[payload.table as keyof typeof schema];

    try {
        console.log("/create_row request: ", payload)
        const data = await db
            .update(tableSchema)
            .set({ messages: payload.messages }) // todo: future update this to be dynamic
            .where(eq((tableSchema as any).session_id, payload.session_id))
            .returning();

        // console.log("/create_row data: ", data)

        return c.json(data, 201);
        
    } catch (error: any) {
        console.error(error.message, "Error updating database");
        
        return c.json(error, 500);
    };
});

// !! DEPRECATED !!
/**
 * @swagger
 * /database/create_row:
 *   get:
 *     summary: Returns stuff
 *     tags: [database]
 *     responses:
 */ 
databaseRoutes.post('/create_row', async (c: Context) => {
    const table = c.req.query('table');
    const { db } = c.var;
    const tableSchema = schema[table as keyof typeof schema];
    const payload = await c.req.json();

    try {
        console.log("/create_row request: ", table, payload)
        const data = await db
            .insert(tableSchema)
            .values(payload)
            .returning();

        // console.log("/create_row data: ", data)

        return c.json(data, 201);
        
    } catch (error: any) {
        console.error(error);
        
        return c.json(error, 500);
    }
});


/**
 * @swagger
 * /database/write_db:
 *   get:
 *     summary: Add stuff
 *     responses:
 */
databaseRoutes
    .post('/write_db', validator('json', (value: any, c: Context) => {
        // Validations on the server side for POST requests
        const table = c.req.query('table');

        if (value?.created_at) delete value.created_at; // Supabase will autopopulate this field

        const formattedValues = {
            ...value,
            id: parseInt(value.id),
            weight: parseInt(value.weight)
        };

        const parsed = (validationMap[table as keyof typeof validationMap] as any).safeParse(formattedValues);
        
        if (!parsed.success) return c.text('Invalid!', 401);

        return parsed.data;

    }),
    // Route definition
    async (c: Context) => {
        const { db } = c.var;
        const table = c.req.query('table');
        const tableSchema = schema[table as keyof typeof schema];
        const validatedData = c.req.valid("json" as "json");

        try {
            const data = await db
                .insert(tableSchema)
                .values(validatedData)
                .returning();

            return c.json(data, 201);
            
        } catch (error: any) {
            console.error(error, "Error while writing to table: ", table);
            
            return c.json(error, 500);
        }
    });

/**
 * @swagger
 * /database/write_db:
 *   get:
 *     summary: Add stuff
 *     responses:
 */
databaseRoutes
    .put('/write_db', validator('json', (value: any, c: Context) => {
        // Validations on the server side for POST requests
        const table = c.req.query('table');

        if (value?.created_at) delete value.created_at; // Supabase will autopopulate this field

        const formattedValues = {
            ...value,
            id: parseInt(value.id),
            weight: parseInt(value.weight)
        };

        const parsed = (validationMap[table as keyof typeof validationMap] as any).safeParse(formattedValues);
        
        if (!parsed.success) return c.text('Invalid!', 401);

        return parsed.data;

    }),
    // Route definition
    async (c: Context) => {
        const { db } = c.var;
        const table = c.req.query('table');
        const tableSchema = schema[table as keyof typeof schema];
        const validatedData = c.req.valid("json" as "json");

        try {
            const data = await db
                .update(tableSchema)
                .set(validatedData)
                .returning();

            return c.json(data, 201);
            
        } catch (error: any) {
            console.error(error, "Error while writing to table: ", table);
            
            return c.json(error, 500);
        }
    });

export { databaseRoutes };