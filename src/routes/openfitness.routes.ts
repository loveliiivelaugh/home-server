// Packages
import { Hono } from 'hono';
import { Context } from 'hono';
// Utilities
import { openfitnessScripts } from '../scripts/openfitness.scripts';

// // Types
// import { OpenFitnessTables } from '../../types/openfitness.types';


const openfitnessRoutes = new Hono();


/**
 * @openapi
 * /api/openfitness/fitness_tables:
 *   get:
 *     description: Gets all tables for OpenFitness and formats and organizes them
 *       for the front end to display in visualizations.
 *     responses:
 */
openfitnessRoutes.get('/fitness_tables', async (c: Context) => {
    const { db } = c.var; // Get db from context

    if (!db) return c.text('Database not found.');

    try {

        const data: any = await openfitnessScripts.getAllTables(db);

        return c.json(data);

    } catch (error) {

        return c.json({ error_message: "Something went wrong!", error });
    }
});

export { openfitnessRoutes };
