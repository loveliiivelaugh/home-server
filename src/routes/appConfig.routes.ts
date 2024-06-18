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

            return c.json({
                cms,
                themeConfig,
                crossPlatformStateTable: result
            });

        } catch (error: any) {

            return c.json(error);
        }
    });

export { appConfigRoutes };
