import { Hono } from 'hono';
import { Context } from 'hono';

import { crossPlatformRoutes } from './crossplatform.routes';
import { openfitnessRoutes } from "./openfitness.routes";
import { databaseRoutes } from "./database.routes";
import { sensativeRoutes } from './sensative.routes';
import { appConfigRoutes } from './appConfig.routes';
import { cameraRoutes } from './camera.routes';
import { notionRoutes } from './notion.routes';
import { userRoutes } from './user.routes';
// experimental
import { googleRoutes } from './google.routes';

import { themeConfig as microservicesThemeConfig } from '../../config/theme.config';
import { paths } from '../../config/clients.config';
import { cms } from '../../config/cms';


const routes = new Hono();


// These top two routes need to be !! Deprecated !!
// ... in favor of appConfig Route
// Shared Theme for microservices
routes.get(
    paths.theme, 
    (c: Context) => c.json(microservicesThemeConfig)
);

// Shared Microservices Content
routes.get(
    paths.cms, 
    (c: Context) => c.json(cms)
);

routes.route(paths.camera, cameraRoutes);
routes.route(paths.database, databaseRoutes);
routes.route(paths.appConfig, appConfigRoutes);
routes.route(paths.sensative, sensativeRoutes);
routes.route(paths.openfitness, openfitnessRoutes);
routes.route('/api/v1/notion', notionRoutes);
routes.route(paths.cross_platform, crossPlatformRoutes);
routes.route(paths.users, userRoutes);
routes.get('/auth/v1/user', async (c: Context) => {
    const decodedJwt = c.get('jwtPayload');
    try {
        if (!decodedJwt) return c.json("No user found", 404);

        return c.json(decodedJwt, 200);

    } catch (error: any) {
        console.error(error, "Error getting user");
        return c.json(error, 500);
    }
});

// experimental
routes.route('/api/google/youtube', googleRoutes);


export { routes };
