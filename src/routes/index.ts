import { Hono } from 'hono';
import { Context } from 'hono';

import { openfitnessRoutes } from "./openfitness.routes";
import { databaseRoutes } from "./database.routes";
import { privateGptRoutes } from './privategpt.routes';

import { themeConfig as microservicesThemeConfig } from '../../config/theme.config';
import { paths } from '../../config/clients.config';
import { cms } from '../../config/cms';



const routes = new Hono();

// Theme for microservices
routes.get(
    paths.theme, 
    async (c: Context) => c.json(microservicesThemeConfig)
);

// Shared Microservices Content
routes.get(
    paths.cms, 
    async (c: Context) => c.json(cms)
);

routes.route(paths.database, databaseRoutes);
routes.route(paths.privategpt, privateGptRoutes);
routes.route(paths.openfitness, openfitnessRoutes);

routes.get('/', (c: Context) => c.text('Welcome to the FamilyAppsSuite server!'));


export { routes };