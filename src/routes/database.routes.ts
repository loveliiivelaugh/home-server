// Packages
import { Hono } from 'hono';
import { Context } from 'hono';

import { schema } from '../../db';


const databaseRoutes = new Hono();


/**
 * @openapi
 * /database/read_schema:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
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