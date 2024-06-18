import { Hono } from 'hono';
import { Context } from 'hono';

import { crossPlatformRoutes } from './crossplatform.routes';
import { openfitnessRoutes } from "./openfitness.routes";
import { databaseRoutes } from "./database.routes";
import { sensativeRoutes } from './sensative.routes';
import { appConfigRoutes } from './appConfig.routes';

import { themeConfig as microservicesThemeConfig } from '../../config/theme.config';
import { paths } from '../../config/clients.config';
import { cms } from '../../config/cms';


const routes = new Hono();

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

routes.route(paths.appConfig, appConfigRoutes);
routes.route(paths.database, databaseRoutes);
routes.route(paths.sensative, sensativeRoutes);
routes.route(paths.openfitness, openfitnessRoutes);
routes.route(paths.cross_platform, crossPlatformRoutes);


export { routes };
