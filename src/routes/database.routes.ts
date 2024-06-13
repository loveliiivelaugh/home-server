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
 *       200:
 *         description: {
 *             "data": [
 *                 {
 *                     "table_name": "table_name",
 *                     "columns": [
 *                         "column_name",
 *                         "column_name",
 *                         "column_name"
 *                     ]
 *                 }
 *             ]
 *         }
 *  
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
 *     tags: [database]
 *     responses:
 *       200:
 *         description: A JSON array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
databaseRoutes.get('/read_db', async (c: Context) => {
    const table = c.req.query('table') || 'table_name';
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

        return c.json(data);

    } catch (error: any) {
        console.error(error);
        
        return c.json(error);
    }
});


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


export { databaseRoutes };