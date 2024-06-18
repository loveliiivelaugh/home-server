// Packages
import { Hono } from 'hono';
import { Context } from 'hono';

import { schema } from '../../db';


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
        const tablesWithColumns = tables.map((table: string | any) => ({
            table,
            columns: Object.keys((schema as any)[table]),
        }));

        return c.json(tablesWithColumns);

    } catch (error: any) {

        return c.json(error);
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
    const { sensativeClient } = c.var.clients;
    const { db } = c.var;

    const options = {
        columns: {
            name: true,
            value: true,
            messages: false, //ignored
        },
    };
    
    try {
        
        const data = await db
            .query
            ?.[table]
            .findMany(options);

        if (table === "models") {
            
            let path = "api/v1/ollama/available-models";
            const ollamaModels = (await sensativeClient.get(path)).data;

            const modelNamesInDb = data.map(({ value }: { value: any }) => value);

            const modelsNotAddedYet = ollamaModels.models
                .map((ollamaModel: any) => {
                    if (!modelNamesInDb.includes(ollamaModel.name)) 
                        return ({
                            // id: uuidv4(),
                            name: ollamaModel.name,
                            value: ollamaModel.name
                        });
                }).filter((value: null | undefined) => value); // Remove null or undefined values

            if (modelsNotAddedYet.length) {
                const result = await db
                    .insert(schema.models)
                    .values(modelsNotAddedYet)
                    .returning();

                return c.json([ ...data, ...result ]);
            }
            else return c.json(data);
        }
        else return c.json(data);

    } catch (error: any) {
        console.error(error);
        
        return c.json(error);
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
        
        return c.json(filteredData || []);
        
    } catch (error: any) {
        console.error(error)
        
        return c.json(error)
    }
});

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
    const payload = await c.req.parseBody();

    try {
        // console.log("/create_row request: ", table, c.body)
        const data = await db
            .insert(tableSchema)
            .values(payload)
            .returning();

        // console.log("/create_row data: ", data)

        return c.json(data);
        
    } catch (error: any) {
        console.error(error)
        
        return c.json(error)
    }
});

/**
 * @swagger
 * /database/write_db:
 *   get:
 *     summary: Add stuff
 *     responses:
 */
databaseRoutes.post('/write_db', async (c: Context) => {
    const table = c.req.query('table');
    const { db } = c.var;
    const tableSchema = schema[table as keyof typeof schema];
    const payload = await c.req.json();

    try {
        console.log("/database/create_row request: ", table, payload)
        const data = await db
            .insert(tableSchema)
            .values(payload)
            .returning();

        console.log("/database/create_row data: ", data)

        return c.json(data);
        
    } catch (error: any) {
        console.error(error, "Error while writing to table: ", table);
        
        return c.json(error);
    }
});

export { databaseRoutes };