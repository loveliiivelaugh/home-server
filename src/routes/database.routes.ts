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
            columns: Object.keys(schema[table]),
        }));

        return c.json(tablesWithColumns);

    } catch (error: any) {

        return c.json(error);
    }
});

export { databaseRoutes };