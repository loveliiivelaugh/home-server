import { Hono } from 'hono';
import { Context } from 'hono';

import { cms } from '../../config/cms';
import { themeConfig } from '../../config/theme.config';


const appConfigRoutes = new Hono();


appConfigRoutes
    .get('/', async (c: Context) => {
        const { db } = c.var;

        try {
            const result = await db
                .query
                .cross_platform_apps
                .findMany();
            
            // Should be able to filter by cpx id

            return c.json({
                cms,
                themeConfig,
                crossPlatformStateTable: result
            }, 200);

        } catch (error: any) {

            return c.json(error, 500);
        }
    });

export { appConfigRoutes };
